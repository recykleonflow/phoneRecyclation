import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {AuthorizedResource} from '../../authorization/decorator/authorized.resource';
import {RewardPayload} from '../../../../../libs/shared_models/model/reward-payload.model';
import {RewardsService} from '../service/rewards.service';

@Controller('rewards')
export class RewardsController {

    constructor(private rewardsService: RewardsService) {
    }
    @Get('')
    // @AuthorizedResource()
    public getRewards(
        @Query('userId') userId: string,
    ): Promise<RewardPayload[]> {
        return this.rewardsService.getRewards(userId);
    }

    @Post('redeem')
    public async redeemReward(
        @Body() body: { 
            userId: string,
            rewardId: string
        }
    ) {
        await this.rewardsService.redeemReward(body.userId, body.rewardId);
    }
}
