import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import { config } from 'dotenv';
import {PhoneEntity} from '../entities/phone.entity';
import {UserPhoneEntity} from '../entities/user-phone.entity';
import {UserEntity} from '../entities/user.entity';
import { RewardsEntity} from '../entities/rewards.entity';
import {CompanyEntity} from '../entities/company.entity';
import {MaterialsEntity} from '../entities/materials.entity';
import {RecyclationFactEntity} from '../entities/recyclation-fact.entity';
import {ConfigurationEntity} from '../entities/configuration.entity';
import {GeneratedBackgroundEntity} from '../entities/generated-background.entity';
import { UserRewardEntity } from '../entities/user-reward.entity';
const configService = new ConfigService();
config();

export const options: any = {
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        // entities: ['apps/server/src/core/db/entities/*.entity.{ts,js}'],
        entities: [PhoneEntity, UserPhoneEntity, UserEntity, CompanyEntity, MaterialsEntity, RecyclationFactEntity, RewardsEntity, ConfigurationEntity,
                GeneratedBackgroundEntity, UserRewardEntity],
        migrations: [configService.get('PRODUCTION')
            ? 'apps/server/src/migrations/*.js'
            : 'apps/server/src/migrations/*{.js,.ts}'],
        synchronize: false,
        migrationsRun: true,
        ssl: {
                rejectUnauthorized: false
        }
        // extra: {
        //         rejectUnauthorized: false,
        // },
        // entities: [PhoneEntity],
}
