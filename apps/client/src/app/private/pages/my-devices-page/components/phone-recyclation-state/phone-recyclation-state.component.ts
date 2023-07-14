import {Component, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NftCardComponent } from 'src/app/shared/components/nft-card/nft-card.component';
import { UserPhonePayload } from '../../../../../../../../../libs/shared_models/model/user-phone-payload';
import { RecycleState } from '../../../../../../../../../libs/shared_models/enum/recycleState';

@Component({
  selector: 'recykle-mono-phone-recyclation-state',
  templateUrl: './phone-recyclation-state.component.html',
  styleUrls: ['./phone-recyclation-state.component.scss'],
})
export class PhoneRecyclationStateComponent {
  public recyclationStates = RecycleState;
  @Input() device!: UserPhonePayload;
  @Input() recycled: boolean = false;

  constructor(private dialog: MatDialog) {
  }

  onGetCard() {
    this.dialog.open(NftCardComponent, {
      data: {
        showMetadata: false,
        userPhone: this.device,
      }
    });
  }
}
