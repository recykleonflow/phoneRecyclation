import {Component, OnInit} from '@angular/core';
import {PhoneService} from '../../service/phone/phone.service';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import {LoadingService} from '../../../loading.service';
import { UserPhonePayload } from '../../../../../../../libs/shared_models/model/user-phone-payload';
import {filter} from 'rxjs';

@Component({
  selector: 'app-my-devices-page',
  templateUrl: './my-devices-page.component.html',
  styleUrls: ['./my-devices-page.component.scss']
})
export class MyDevicesPageComponent implements OnInit {
  public phonesInProgress: UserPhonePayload[] = [];
  public phonesRecykled: UserPhonePayload[] = [];

  public isLoading: boolean = false;
  RecyclationState = RecycleState;
  constructor(
              private phoneService: PhoneService,
              public loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.isLoading = true;
    this.phoneService.getHandedOverPhones()
        .pipe(filter((allPhones) => !!allPhones))
        .subscribe((allPhones) => {
      this.phonesInProgress = allPhones.items.filter(x=>
          (x.state !== RecycleState.RECYCLED && x.state !== RecycleState.REFURBISHED && x.state !== RecycleState.RESOLD) || !x.nftData?.isRevealed
      );
      this.phonesRecykled = allPhones.items.filter(x=>
          (x.state === RecycleState.RECYCLED || x.state === RecycleState.REFURBISHED || x.state === RecycleState.RESOLD) && x.nftData?.isRevealed
      );

      this.loadingService.isLoading = false;
    });
  }

  trackByPhone = (index, item: any) => {
    return item.id;
  };
}
