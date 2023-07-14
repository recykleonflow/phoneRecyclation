import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OtPhoneParametersModel} from '../../../../../../../libs/shared_models/model/ot-phone-parameters.model';
import {PhoneHistoryPayload} from '../../../../../../../libs/shared_models/model/phone-history-payload.model';

@Component({
  selector: 'recykle-mono-phone-detail-page',
  templateUrl: './phone-detail-page.component.html',
  styleUrls: ['./phone-detail-page.component.scss'],
})
export class PhoneDetailPageComponent {
    public historicPhones: any[] = [];

    constructor(
      private route: ActivatedRoute
  ) {}

  ngOnInit() {
      this.route.data
          // .pipe(takeUntil(this.unsubscribe$))
          .subscribe((data) => {
              this.historicPhones = (data as any).phones
          });
  }
}
