import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserPhoneEntity} from '../../../core/entities/user-phone.entity';
import { UserPhoneSimple } from '../../../../../../libs/shared_models/model/user-phones-simple.model';
import { UserPhonePayload } from '../../../../../../libs/shared_models/model/user-phone-payload';
import { NftDataPayload } from '../../../../../../libs/shared_models/model/nft-data-payload';
import { CardRarity } from '../../../../../../libs/shared_models/enum/card-rarity.enum';
import { PhoneHandlerService } from './phone-handler.service';

@Injectable()
export class PhoneMappingService {
    public IMAGE_QUALITY = 75;
    public IMAGE_WIDTH = 400;
    
    constructor(
        private phoneHandlerService: PhoneHandlerService,
        @InjectRepository(UserPhoneEntity) private readonly userPhoneRepository: Repository<UserPhoneEntity>,
    ) {}

    public async mapUserPhoneToUserPhonePayload(userPhone: UserPhoneSimple): Promise<UserPhonePayload> {
        const ual = await this.phoneHandlerService.getUal(userPhone.phone)
        const dbPhone = await this.userPhoneRepository.findOne({where: {ual}});
        let state = userPhone.state;

        if (process.env.PRESENTATION_MODE) {
            const userPhone = await this.userPhoneRepository.findOneBy({ual});
            state = userPhone.state ? userPhone.state : state;
        }

        return {
            ...new UserPhonePayload(),
            imei: userPhone.imei,
            model: userPhone.model,
            ual,
            batteryExtracted: userPhone.batteryExtracted,
            materialsExtracted: userPhone.materialsExtracted,
            ownerEmail: userPhone.ownerEmail,
            donorPhoneNumber: userPhone.donorPhoneNumber,
            state,
            createdAt: userPhone.createdAt,
            handedOverAt: userPhone.handedOverAt,
            title: userPhone.title,
            visualCondition: userPhone.visualCondition,
            phoneUrl: process.env.PINATA_GATEWAY + userPhone.phoneIpfs?.replace(/"/g, ''),
            nftData: {
                ...new NftDataPayload(),
                ual,
                model: userPhone.model,
                imei: userPhone.imei,
                state: userPhone.state,
                // different date prob
                createdAt: new Date().toLocaleDateString(),
                isClaimed: dbPhone.isCardClaimed,
                isRevealed: dbPhone.isCardRevealed,
                // for now
                rarity: CardRarity.LEGENDARY,
                phoneUrl: process.env.PINATA_GATEWAY + userPhone.phoneIpfs?.replace(/"/g, '') + `?img-width=${this.IMAGE_WIDTH}`,
                backgroundUrl: process.env.PINATA_GATEWAY + userPhone.backgroundIpfs?.replace(/"/g, '') + `?img-width=${this.IMAGE_WIDTH}`,
                compositeUrl: process.env.PINATA_GATEWAY + userPhone.compositeIpfs?.replace(/"/g, '') + `?img-width=${this.IMAGE_WIDTH}`,
                metadataIpfsUrl: process.env.PINATA_GATEWAY + userPhone.metadataIpfs?.replace(/"/g, ''),
                //metadataIpfsUrl: `ipfs://${userPhone.metadataIpfs?.replace(/"/g, '')}`,
            }
        }
    }
}
