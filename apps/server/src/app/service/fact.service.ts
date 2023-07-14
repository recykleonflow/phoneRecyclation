import {Injectable} from '@nestjs/common';
import {ImageGenerationService} from '../../image-generation/service/image-generation.service';
import {OriginTrailService} from '../../origin-trail/service/origin-trail.service';
import {InjectRepository} from '@nestjs/typeorm';
import {UserPhoneEntity} from '../../core/entities/user-phone.entity';
import {Repository} from 'typeorm';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {RecyclationFactEntity} from '../../core/entities/recyclation-fact.entity';

@Injectable()
export class FactService {


    constructor(
                @InjectRepository(RecyclationFactEntity)
                private readonly factEntityRepository: Repository<RecyclationFactEntity>
    ) {

    }

    async getFacts(): Promise<{ text: string }[]> {
        const facts = await this.factEntityRepository.createQueryBuilder().getMany();
        return facts.map(fact => ({text: fact.text}));
    }
}
