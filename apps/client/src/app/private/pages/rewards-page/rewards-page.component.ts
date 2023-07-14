import {Component, OnInit} from '@angular/core';
import {RewardsService} from '../../service/rewards/rewards.service';
import {RewardPayload} from '../../../../../../../libs/shared_models/model/reward-payload.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {UserPayload} from '../../../../../../../libs/shared_models/model/user-payload.model';
import { MatDialog } from '@angular/material/dialog';
import { RewardRedeemConfirmationComponent } from './reward-redeem-confirmation/reward-redeem-confirmation.component';

@Component({
  selector: 'app-rewards-page',
  templateUrl: './rewards-page.component.html',
  styleUrls: ['./rewards-page.component.scss']
})
export class RewardsPageComponent implements OnInit {
    public rewards$!: Observable<RewardPayload[]>;
    public user!: UserPayload;

  constructor(private rewardsService: RewardsService, private authService: AuthService, private dialog: MatDialog) {
  }

  ngOnInit() {
      this.user = this.authService.userData;
      this.rewards$ = this.rewardsService.getUserRewards(this.user.id);
  }

  onRedeem(reward: RewardPayload) {
    const dialogRef = this.dialog.open(RewardRedeemConfirmationComponent, {
      data: {
        reward,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardsService.redeemReward(this.user.id, reward.id).subscribe(res => {
          this.rewards$ = this.rewardsService.getUserRewards(this.user.id);
          this.user.balance-=reward.cost;
        });        
      }
    });
  }

}
