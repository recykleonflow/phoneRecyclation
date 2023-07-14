import {Component, OnInit} from '@angular/core';
import { PhoneService } from '../../service/phone/phone.service';
import { UserPhonePayload } from '../../../../../../../libs/shared_models/model/user-phone-payload';
import { CardRarity } from '../../../../../../../libs/shared_models/enum/card-rarity.enum';
import { RecycleState } from '../../../../../../../libs/shared_models/enum/recycleState';

@Component({
  selector: 'app-my-collection',
  templateUrl: './my-collection.component.html',
  styleUrls: ['./my-collection.component.scss']
})
export class MyCollectionComponent implements OnInit {
    public myCards: UserPhonePayload[] = [];
    
    constructor(private phoneService: PhoneService) {
    }

    ngOnInit() {
        this.phoneService.getHandedOverPhones()
            .subscribe(
                (cards) => {
                    this.myCards = cards.items.filter(x=>x.nftData.isRevealed);
                });
    }
}
