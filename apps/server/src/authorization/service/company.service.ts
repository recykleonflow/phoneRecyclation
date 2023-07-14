import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';
import {plainToInstance} from 'class-transformer';
import {CompanyEntity} from '../../core/entities/company.entity';
import {CompanyType} from '../../../../../libs/shared_models/enum/company-type';
import {CompanyPayload} from '../../../../../libs/shared_models/model/company-payload.model';

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(CompanyEntity)
                private readonly companyEntityRepository: Repository<CompanyEntity>) {
    }

    public async getAllRetailCompanies(): Promise<CompanyPayload[]> {
        const companies = await this.companyEntityRepository.find({where: {type: CompanyType.RETAIL}});
        return plainToInstance(CompanyPayload, companies);
    }
}
