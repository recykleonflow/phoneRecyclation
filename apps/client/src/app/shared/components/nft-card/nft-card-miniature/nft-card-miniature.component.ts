import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NftCardComponent } from '../nft-card.component';
import { NftDataPayload } from '../../../../../../../../libs/shared_models/model/nft-data-payload';
import { UserPhonePayload } from '../../../../../../../../libs/shared_models/model/user-phone-payload';

@Component({
  selector: 'app-nft-card-miniature',
  templateUrl: './nft-card-miniature.component.html',
  styleUrls: ['./nft-card-miniature.component.scss'],
})
export class NftCardMiniatureComponent {
    @Input() userPhone: UserPhonePayload = new UserPhonePayload();
    
    constructor(private dialog: MatDialog) {}

    onClick() {
      this.dialog.open(NftCardComponent, {
        data: {
          showMetadata: true,
          userPhone: this.userPhone,
        }
      });
    }
}
