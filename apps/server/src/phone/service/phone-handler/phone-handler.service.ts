import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ImageGenerationService} from '../../../image-generation/service/image-generation.service';
import {OriginTrailService} from '../../../origin-trail/service/origin-trail.service';
import {InjectRepository} from '@nestjs/typeorm';
import {PhoneEntity} from '../../../core/entities/phone.entity';
import {Repository} from 'typeorm';
import {UserPhoneEntity} from '../../../core/entities/user-phone.entity';
import {UserPayload} from '../../../../../../libs/shared_models/model/user-payload.model';
import {PhoneHandoverDto} from '../../../origin-trail/model/phone-handover-dto';
import {ID_PREFIX} from '../../../origin-trail/service/const';
import {UserService} from '../../../authorization/service/user.service';
import {RecycleState} from '../../../../../../libs/shared_models/enum/recycleState';
import {OtPhoneParametersModel} from '../../../../../../libs/shared_models/model/ot-phone-parameters.model';
import {UalPhoneMapperUtil} from '../../../../../../libs/util/ual-phone-mapper.util';
import {v4 as uuid} from 'uuid';
import {LiveUpdateService} from './live-update.service';
import {UpdatedEntityType} from '../../../../../client/src/app/shared/services/live-update/updated-entity.enum';
import {UserEntity} from '../../../core/entities/user.entity';
import {ChangeStateBody} from '../../../../../../libs/shared_models/model/change-state-body.model';
import {SimpleRequestPhone} from '../../../../../../libs/shared_models/model/simple-request-phone.model';
import {OtHelper} from '../../../origin-trail/ot-helper';
import moment from 'moment';

@Injectable()
export class PhoneHandlerService {


    constructor(private imageGenerationService: ImageGenerationService,
                private originTrailService: OriginTrailService,
                private liveUpdateService: LiveUpdateService,
                private userService: UserService,
                @InjectRepository(UserPhoneEntity)
                private readonly userPhoneRepository: Repository<UserPhoneEntity>,
                @InjectRepository(PhoneEntity)
                private readonly phoneRepository: Repository<PhoneEntity>
                ) {

    }

    public async getStatistics() {
        const blockchainStatistics = await this.originTrailService.getStatistics();
        return blockchainStatistics;
    }
    
    public async changeState(ual: string, user: UserPayload, params: ChangeStateBody) {
        await this.originTrailService.changePhoneState(ual, params, user);
        const phoneByUal = await this.originTrailService.getEntityByUal(ual);
        const phone = UalPhoneMapperUtil.mapUalToPhone(phoneByUal);
        if (process.env.PRESENTATION_MODE) {
            const dbPhone = await this.userPhoneRepository.findOneBy({ual})
            await this.userPhoneRepository.save({...dbPhone, state: params.state});
        }
        await this.liveUpdateService.performUpdate(UpdatedEntityType.PHONE, phone.owner);
        return phone;
    }

    public async revealNftCard(ual: string) {
        const phone = await this.userPhoneRepository.findOne({where: {ual}});
        await this.userPhoneRepository.save({
            ...phone,
            isCardRevealed: true,
        });
    }

    public async claimNftCard(ual: string) {
        const phone = await this.userPhoneRepository.findOne({where: {ual}});
        await this.userPhoneRepository.save({
            ...phone,
            isCardClaimed: true,
        });
    }
    
    public async getPhoneByUalAndSetState(ual: string, currentUser: UserPayload, setState?: RecycleState): Promise<OtPhoneParametersModel> {
        const result = await this.originTrailService.getEntityByUal(ual);
        const phone = UalPhoneMapperUtil.mapUalToPhone(result);

        // if (phone.state === RecycleState.IN_TRANSIT) {
        //     try {
        //         await this.originTrailService.changePhoneState(ual, setState, currentUser);
        //         await this.liveUpdateService.performUpdate(UpdatedEntity.PHONE, phone.owner);
        //         return await this.originTrailService.getEntityByUal(ual);
        //     } catch (e) {
        //         console.error('ERROR HAPPENED HERE');
        //         console.error(e)
        //     }
        //
        // }
        return phone;
    }

    public async getUal(userPhoneId: string): Promise<string> {
        const phoneId = this.normalizeDkgId(userPhoneId);
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        const isUUID = regexExp.test(phoneId)

        if (isUUID) {
            const userPhone = await this.userPhoneRepository.findOneBy({id: phoneId});
            return userPhone?.ual;
        } else {
            return;
        }
    }

    public async checkImei(imei: string): Promise<void> {
        const phone = await this.userPhoneRepository.findOneBy({imei});
        if (phone) {
            throw new HttpException('Imei taken', HttpStatus.BAD_REQUEST);
        }
    }

    public async addPhone(user: UserPayload, data: PhoneHandoverDto): Promise<SimpleRequestPhone> {
        const dbId = uuid();
        await this.checkImei(data.imei);
        const owner = await this.getOrCreateOwner(data.donorEmail, data.donorPhoneNumber);
        const phoneInDb = await this.userPhoneRepository.save(this.userPhoneRepository.create({
            id: dbId,
            userId: user.id,
            phoneId: data.phoneId,
            imei: data.imei,
            handedOverById: owner.id
        }));

        const phone = await this.getPhoneById(data.phoneId);
        const generatedImageOutput = await this.imageGenerationService.generateImageFast(phone.model, data.imei);
        const ual = await this.originTrailService.insertPhone(phone, data, user, owner.id, generatedImageOutput, dbId);
        await this.userPhoneRepository.save({...phoneInDb, ual})
        // todo: add to reveal
        await this.userService.addPoints(phone, owner.id);
        await this.liveUpdateService.performUpdate(UpdatedEntityType.PHONE, owner.id);
        // await this.liveUpdateService.performUpdate(UpdatedEntityType.QUEUE, phone.owner);
        return {ual, imei: data.imei, state: RecycleState.RECEIVED, model: phone.model, createdAt: OtHelper.generateOtDate(),}
    }

    public async getOrCreateOwner(ownerEmail: string, phoneNumber: string): Promise<UserEntity> {
        const owner = await this.userService.getUserEntityByEmail(ownerEmail);
        if (owner) {
            if (owner.phoneNumber !== phoneNumber) {
                await this.userService.updateUser(
                     {
                         ...owner,
                        phoneNumber
                    }
                )
            }
            return owner
        } else {
            const newUser = await this.userService.createDbUser(null, ownerEmail, phoneNumber);
            return newUser;
        }
    }

    public async getPhoneById(id: string): Promise<PhoneEntity> {
        return this.phoneRepository.findOneBy({id})
    }

    public normalizeDkgId(dkgId: string): string {
        return dkgId.slice(dkgId.indexOf(ID_PREFIX) + ID_PREFIX.length);
    }
}
