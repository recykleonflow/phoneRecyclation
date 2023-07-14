import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {Column, ILike, In, Repository} from 'typeorm';
import {PhonePayload} from '../../../../../libs/shared_models/model/phone-payload.model';
import {plainToInstance} from 'class-transformer';
import {UserPhoneEntity} from '../../core/entities/user-phone.entity';
import {MaterialsEntity} from '../../core/entities/materials.entity';
import {CalculationUtil} from '../../../../../libs/util/calculation.util';

@Injectable()
export class PhoneModelService {
    constructor(
        @InjectRepository(PhoneEntity)
        private readonly phoneRepository: Repository<PhoneEntity>,
        @InjectRepository(MaterialsEntity)
        private readonly materialsEntityRepository: Repository<MaterialsEntity>,
        @InjectRepository(UserPhoneEntity)
        private readonly userPhoneRepository: Repository<UserPhoneEntity>) {}

    public async getMaterials(imeis: string[]): Promise<{[material: string]: number}> {
        const materials = await this.userPhoneRepository.find({where: {imei: In(imeis)}, relations: ['phone', 'phone.materials']});

        return materials.reduce((acc, userPhone) => {
            const phoneMaterials = userPhone.phone.materials;
            Object.keys(phoneMaterials).map(material => {
                acc[material] = (acc[material] || 0) + phoneMaterials[material];
            })
            return acc;
        }, {})
    }

    public async queryPhoneModels(query: string): Promise<PhonePayload[]> {
        const phones = await this.phoneRepository
            .createQueryBuilder('phone')
            .leftJoin('phone.materials', 'materials')
            .addSelect(['materials.plastic', 'materials.glass', 'materials.gold', 'materials.silver',
                'materials.paladium', 'materials.platinum', 'materials.aluminium', 'materials.copper', 'materials.lithium'
            ])
            .where('phone."model" ilike :query', {query: `%${query}%`, similarity: 0.6})
            .getMany();

        return plainToInstance(PhonePayload, phones);
    }

    public async checkImei(imei: string): Promise<{ isUsed: boolean }> {

        const phone = await this.userPhoneRepository.findOneBy({imei});
        return {isUsed: phone !== null};
    }

    public async mockValuable() {
        const batchSize = 500; // Adjust this value as needed.
        let page = 0;
        while (true) {
            const entities = await this.phoneRepository.find({
                take: batchSize,
                skip: page * batchSize,
            });

            if (entities.length === 0) {
                break;
            }

            for (const entity of entities) {
                entity.materials = this.createMaterialMock();
            }

            await this.phoneRepository.save(entities);
            page += 1;
        }
    }

    createMaterialMock(): MaterialsEntity {
        return this.materialsEntityRepository.create({
            aluminium: CalculationUtil.getRandomNumber(0.3, 5),
            glass: CalculationUtil.getRandomNumber(3, 5),
            lithium: CalculationUtil.getRandomNumber(2, 4),
            paladium: CalculationUtil.getRandomNumber(.5, 2),
            plastic: CalculationUtil.getRandomNumber(6, 10),
            platinum: CalculationUtil.getRandomNumber(.3, .8),
            gold: CalculationUtil.getRandomNumber(.1, .4),
            silver: CalculationUtil.getRandomNumber(.3, .7),
            copper: CalculationUtil.getRandomNumber(.7, 2.4),
        })
    }
}
