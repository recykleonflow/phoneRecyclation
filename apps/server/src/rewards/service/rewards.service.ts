import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {RewardsEntity} from '../../core/entities/rewards.entity';
import {RewardPayload} from '../../../../../libs/shared_models/model/reward-payload.model';
import {plainToInstance} from 'class-transformer';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {ConfigurationEntity} from '../../core/entities/configuration.entity';
import {CalculationUtil} from '../../../../../libs/util/calculation.util';
import { UserEntity } from 'src/core/entities/user.entity';
import { UserRewardEntity } from 'src/core/entities/user-reward.entity';


@Injectable()
export class RewardsService {
   constructor(
      @InjectRepository(UserRewardEntity) private readonly userRewardRepository: Repository<UserRewardEntity>,
      @InjectRepository(RewardsEntity) private readonly rewardsRepository: Repository<RewardsEntity>,
      @InjectRepository(ConfigurationEntity) private readonly configurationRepository: Repository<ConfigurationEntity>,
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
   ) {}

   public generateVoucherCode(length: number): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++ ) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
  }

    public async redeemReward(userId: string, rewardId: string) {
      const user = await this.userRepository.findOne({where: {id: userId}});
      const reward = await this.rewardsRepository.findOne({where: {id: rewardId}});

      const userReward = {
         ...new UserRewardEntity(),
         code: this.generateVoucherCode(6),
         user,
         reward,
         createdAt: new Date(),
      }

      await this.userRewardRepository.save(userReward);
      await this.userRepository.save({
         ...user,
         balance: user.balance - reward.cost,
      })
    }

    public async getRewards(userId: string): Promise<RewardPayload[]> {
       const rewards = await this.rewardsRepository.find({relations: ['userRewards']});
       const payload = rewards.map(x => this.mapRewardToRewardPayload(x, userId));
       return payload;
    }

    public async calculatePoints(phoneEntity: PhoneEntity): Promise<number> {
       const configuration = (await this.configurationRepository.find())[0];

       const points = Math.ceil(CalculationUtil.getRandomNumber(configuration.minPointsPerPhone, configuration.maxPointsPerPhone));
       return 200;
    }

    public mapRewardToRewardPayload(reward: RewardsEntity, userId: string) {
      const userReward = reward.userRewards.find(x=>x.userId === userId);
      return {
         ...new RewardPayload(),
         id: reward.id,
         name: reward.name,
         cost: reward.cost,
         description: reward.description,
         shortName: reward.shortName,
         pictureUrl: reward.pictureUrl,
         isClaimed: !!userReward,
         code: userReward?.code,
      }
    }

}
