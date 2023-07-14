import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PhoneEntity} from './core/entities/phone.entity';
import {Repository} from 'typeorm';
import {PhonePayload} from '../../../libs/shared_models/model/phone-payload.model';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(PhoneEntity)
      private readonly phoneRepository: Repository<PhoneEntity>) {}

  public async queryPhoneModels(query: string): Promise<PhonePayload[]> {
    const phones = await this.phoneRepository.find({where: [{model: query}, {brand: query}], take: 50});
    return plainToInstance(PhonePayload, phones);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
