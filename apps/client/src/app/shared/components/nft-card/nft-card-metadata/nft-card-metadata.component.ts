import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UserPhonePayload } from '../../../../../../../../libs/shared_models/model/user-phone-payload';
import { PhoneService } from 'src/app/private/service/phone/phone.service';
import { Observable, map, tap } from 'rxjs';
import { RecycleState } from '../../../../../../../../libs/shared_models/enum/recycleState';

@Component({
  selector: 'app-nft-card-metadata',
  templateUrl: './nft-card-metadata.component.html',
  styleUrls: ['./nft-card-metadata.component.scss'],
})
export class NftCardMetadataComponent implements AfterViewInit {
  @Input() userPhone: UserPhonePayload = new UserPhonePayload();
  public statsMap: Map<number, ElementRef> = new Map();
  public actualStatsIndex: number = 1;
  public maxStatsIndex: number = 4;
  public materials$: Observable<any>;
  public history$: Observable<any>;
  public recyclingCenter$: Observable<string>;

  public materialsLoading = true;
  public historyLoading = true;

  @ViewChild('stats1') stats1!: ElementRef;
  @ViewChild('stats2') stats2!: ElementRef;
  @ViewChild('stats3') stats3!: ElementRef;
  @ViewChild('stats4') stats4!: ElementRef;

  constructor(
    private readonly phoneService: PhoneService,
  ) {}

  ngAfterViewInit() {
    this.statsMap.set(1, this.stats1);
    this.statsMap.set(2, this.stats2);
    this.statsMap.set(3, this.stats3);
    this.statsMap.set(4, this.stats4);
    this.setActiveStats(this.actualStatsIndex);

    this.history$ = this.phoneService.getPhoneHistoryByImei(this.userPhone.imei).pipe(map(history => {
      return history;
    }), tap(() => this.historyLoading = false));

    this.recyclingCenter$ = this.history$.pipe(
      map(history => history.find((x: any) => x.state === RecycleState.RECYCLED)?.company),
    );

    this.materials$ = this.phoneService.getMaterials([this.userPhone.imei]).pipe(map(materials => {
      const {id, ...rest} = materials;
      return rest;
    }), tap(() => this.materialsLoading = false));

    // PRESENTATION ONLY
    this.userPhone.batteryExtracted = true;
    this.userPhone.materialsExtracted = true;
  }

  onLeftArrow() {
    if (this.actualStatsIndex > 1) {
      this.actualStatsIndex--;
      this.setActiveStats(this.actualStatsIndex);
    }
  }

  onRightArrow() {
    if (this.actualStatsIndex < this.maxStatsIndex) {
      this.actualStatsIndex++;
      this.setActiveStats(this.actualStatsIndex);
    }
  }

  setActiveStats(statsPage: number) {
    this.statsMap.forEach((statsElement, index) => {
      if (index === statsPage) {
        statsElement.nativeElement.style.display = 'block';
      } else {
        statsElement.nativeElement.style.display = 'none';
      }
    });
  }

}