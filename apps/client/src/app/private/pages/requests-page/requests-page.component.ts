import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PhoneService} from '../../service/phone/phone.service';
import {DisposableMethod} from '../../../../../../../libs/shared_models/enum/disposable-method.enum';
import {SortDirection} from '@angular/material/sort';
import {UserPhoneSimple} from '../../../../../../../libs/shared_models/model/user-phones-simple.model';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import {PhoneQueue} from '../../service/phone/model/phone-queue.model';
import {OtPhoneParametersModel} from '../../../../../../../libs/shared_models/model/ot-phone-parameters.model';
import {LoadingState} from '../../service/phone/model/loading-state.enum';
import {QueueFunction} from '../../service/phone/queue-function.enum';
import {BarcodeScanner} from '@capacitor-community/barcode-scanner';
import {PlatformHelper} from '../../../util/platform.helper';
import {OngoingRequestsTableComponent} from '../../components/ongoing-requests-table/ongoing-requests-table.component';
import {combineLatest, filter, map, Observable, Subject, Subscription, tap} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.scss']
})
export class RequestsPageComponent implements OnInit, OnDestroy{
  @ViewChild(OngoingRequestsTableComponent) table!: OngoingRequestsTableComponent;

  public hasLoadedQr = false;
  public scanedPhoneCode = '';
  public device: any;
  public openScanner = false;
  public devices: UserPhoneSimple[] = [];
  
  public owner = '';
  public model = '';
  public imei = '';
  public condition = '';
  public ual = '';
  scannedData: any;
  scannedPhones = 0;

  public companyName = '';
  public method: DisposableMethod = DisposableMethod.RECYCLED;

  public methods = Object.keys(DisposableMethod);

  RecyclationState = RecycleState;
  public recyclationTransferStates = [RecycleState.RECYCLED, RecycleState.RESOLD, RecycleState.REFURBISHED];
  public selectedRows!: PhoneQueue<any, OtPhoneParametersModel>[];
  public isMobilePhone = false;
  public materialsSum$!: Observable<{[material: string]: number}>;
  public stateControl = new FormControl<RecycleState | null>(null);
  public materialsControl = new FormControl<boolean>(false);
  public batteryControl = new FormControl<boolean>(false);
  public subscription!: Subscription;
  public reloadMaterials$ = new Subject<void>();
  public materialsLoading = false;

  constructor(private phoneService: PhoneService,
              private requestQueueService: RequestQueueService) {
      this.isMobilePhone = !PlatformHelper.isMobile()
  }

  get data() {
    return this.requestQueueService.requestQueue
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {

    this.subscription = combineLatest([
        this.stateControl.valueChanges,
        this.reloadMaterials$,
        this.materialsControl.valueChanges.pipe(filter(shouldLoad => !!shouldLoad))
    ]).subscribe( ([state]) => {
          if (state === RecycleState.RECYCLED) {
            this.materialsLoading = true;
            this.materialsSum$ =
                this.phoneService.getMaterials(this.selectedRows.map(phone => (phone.response as any).imei as string))
                    .pipe(map(materials => {
                      const {id, ...rest} = materials;
                      return rest;
                    }),
                        tap(() => this.materialsLoading = false))
          }
        })

  }
  afterSelection(selectedRows: PhoneQueue[]): void {
    this.selectedRows = selectedRows;
    this.reloadMaterials$.next();
  }

  transferToState(state: RecycleState): void {

    this.requestQueueService.performMultipleRequests(this.selectedRows.map(row =>
            ({state, ual: row.ual, materialsExtracted: this.materialsControl.value, batteryExtracted: this.batteryControl.value})),
        QueueFunction.CHANGE_STATE, this.selectedRows,
        this.selectedRows.map(row => row.id), LoadingState.WRITING_INTO_BLOCKCHAIN);
    this.table.deselect();
  }

  toggleScanner() {
      this.scannedPhones = 0;
      this.openScanner = !this.openScanner;
  }

  async startScan() {
    document.querySelector('body').classList.add('scanner-active');
    // BarcodeScanner.hideBackground();
    // const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
    // if (result.hasContent) {
    //   this.onScan(result.content);
    // }
  };

  prepare() {
    BarcodeScanner.prepare();
  };

  stopScan() {
    document.querySelector('body').classList.remove('scanner-active');
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

  askUser() {
    this.prepare();

    const c = confirm('Do you want to scan a barcode?');

    if (c) {
      this.startScan();
    } else {
      this.stopScan();
    }
  };



  stop() {
    this.openScanner = false;
  }

  onScan(result: string) {
    if (result) {
      if (result.indexOf('did:dkg:otp') !== -1) {
        const oldQueryLength = this.requestQueueService.requestQueue.length;
        this.loadDeviceByUal(result);
        this.scannedPhones = this.scannedPhones + (this.requestQueueService.requestQueue.length - oldQueryLength);
      } else {
        alert('WRONG QR')
      }
    }
  }

  async scan() {
    // const result = await BarcodeScanner.startScan();
    // console.log(result);
    await BarcodeScanner.checkPermission({ force: true });

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      alert(result.content)
    }
    // this.barcodeScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData);
    //   this.scannedData = barcodeData;
    // }).catch(err => {
    //   console.log('Error', err);
    // });
  }

  loadDeviceByUal(ual: string): void {
    this.scanedPhoneCode = ual;
    // this.hasLoadedQr = true;
    // this.ual = ual;
    this.requestQueueService.performRequest(this.scanedPhoneCode,
        QueueFunction.GET_PHONE_BY_QR,
        {ual: this.scanedPhoneCode}, this.scanedPhoneCode, LoadingState.READING_FROM_BLOCKCHAIN);
    // this.phoneService.getPhoneByQrCode(this.scanedPhoneCode).subscribe(
    //     result => {
    //       this.device = result;
    //       const mappedUalData = UalPhoneMapperUtil.mapUalToPhone(result);
    //       console.log('MAPPED DATA ', mappedUalData);
    //       this.imei = mappedUalData.imei;
    //       this.model = mappedUalData.model;
    //       this.condition = mappedUalData.visualCondition;
    //       this.owner = mappedUalData.owner.email;
    //     }
    // )
  }

  public getProcessedPhones = (sort: string, sortDirection: SortDirection, pageIndex: number, pageSize: number) => {
    return this.phoneService.getProcessedPhones(sort, sortDirection, pageIndex, pageSize)
  };
}

