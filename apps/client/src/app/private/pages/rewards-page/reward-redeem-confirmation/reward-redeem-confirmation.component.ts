import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RewardPayload } from '../../../../../../../../libs/shared_models/model/reward-payload.model';

@Component({
  selector: 'app-reward-redeem-confirmation',
  templateUrl: './reward-redeem-confirmation.component.html',
  styleUrls: ['./reward-redeem-confirmation.component.scss']
})
export class RewardRedeemConfirmationComponent implements OnInit {
    public reward: RewardPayload;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      this.reward = data.reward;
  }

  ngOnInit() {
  }

}