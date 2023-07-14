import {Module} from '@nestjs/common';
import { RewardsService } from './service/rewards.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RewardsEntity} from '../core/entities/rewards.entity';
import {RewardsController} from './controller/rewards.controller';
import {ConfigurationEntity} from '../core/entities/configuration.entity';
import { UserRewardEntity } from 'src/core/entities/user-reward.entity';
import { UserEntity } from 'src/core/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RewardsEntity, UserRewardEntity, ConfigurationEntity])],
  providers: [RewardsService],
  exports: [RewardsService],
  controllers: [RewardsController]
})
export class RewardsModule {}
