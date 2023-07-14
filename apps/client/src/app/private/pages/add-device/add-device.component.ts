import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap} from 'rxjs';
import {PhoneService} from '../../service/phone/phone.service';
import {UserService} from '../../service/user/user.service';
import {VisualAppeal} from '../../enum/visual-state.enum';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {ImageGenerationService} from '../../service/image-generation/image-generation.service';
import {DomSanitizer} from '@angular/platform-browser';
import {GenerationMethod} from './model/generation-method.enum';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {LoadingState} from '../../service/phone/model/loading-state.enum';
import {PhonePayload} from '../../../../../../../libs/shared_models/model/phone-payload.model';
import {UserPayload} from '../../../../../../../libs/shared_models/model/user-payload.model';
import {QueueFunction} from '../../service/phone/queue-function.enum';
import {SubscribeDirective} from '../../directives/subscribe.directive';

interface PhoneDetailForm {
  brand: FormControl<string>,
  model: FormControl<string>,
}

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent extends SubscribeDirective implements OnInit {
  public selectedUser!: UserPayload | null;
  public generatedImage: any;
  public generationMethods = [
    {
      type: GenerationMethod.FAST,
      name: "Fast generation (~10s)"
    },
    {
      type: GenerationMethod.FULL,
      name: "Full generation (~1m30s)"
    }
  ];
  public selectedGenerationMethod: any = this.generationMethods[0].type;
  

  public phoneDetailForm = new FormGroup<PhoneDetailForm>({
    brand: new FormControl<string>({disabled: true, value: ''}, {nonNullable: true, validators: Validators.required}),
    model: new FormControl<string>({disabled: false, value: ''}, {nonNullable: true}),
  });
  addPhoneForm: FormGroup<{
    model: FormControl<any>,
    imei: FormControl<number | null>,
    phoneDetail: FormGroup<PhoneDetailForm>,
    userEmail: FormControl<string>,
    donorPhoneNumber: FormControl<string>,
    visualCondition: FormControl<number>
  }>;

  filteredModels$: Observable<PhonePayload[]>;
  filteredUsers$: Observable<any[]>;

  selectedPhone!: PhonePayload | null;
  users: any[] = [];
  uri: {ual: string} | null = null;
  isLoading = false;
  isLoadingGeneration = false;
  userLoading = false;
  imeiChecking = false;

  constructor(private formBuilder: NonNullableFormBuilder,
              private phoneQueueService: RequestQueueService,
              private phoneService: PhoneService,
              private imageGenerationService: ImageGenerationService,
              private userService: UserService,
              public authService: AuthService
  ) {
    super();
    this.addPhoneForm = this.formBuilder.group({
      model: new FormControl<string>('', {validators: Validators.required, nonNullable: true}),
      imei: new FormControl<number>(1000000000000, {validators: [Validators.minLength(15), Validators.maxLength(15), Validators.required], nonNullable: true}),
      phoneDetail: this.phoneDetailForm,
      userEmail: new FormControl<string>('', {validators: Validators.required, nonNullable: true}),
      donorPhoneNumber: new FormControl<string>('', {validators: Validators.required, nonNullable: true}),
      visualCondition: new FormControl<number>(0, {nonNullable: true})
    })
    this.filteredModels$ = of([]);
    this.filteredUsers$ = of([]);
  }

  displayUser = (user: any) => user?.email;
  displayModel = (model: any) => model?.model;

  ngOnInit() {

    if (this.addPhoneForm) {
      this.subscriptions.push(this.addPhoneForm.controls.imei.valueChanges.pipe(
          debounceTime(300),
          filter(imei => !!imei && String(imei).length === 15),
          tap(() => this.imeiChecking = true),
          switchMap(imei => this.phoneService.checkImei(imei))
      ).subscribe(({isUsed}) => {
        this.imeiChecking = false;
        if (isUsed) {
          this.addPhoneForm.controls.imei.setErrors({invalidImei:true});
        }
      }));

      this.filteredModels$ = this.addPhoneForm.controls.model
          .valueChanges.pipe(
              tap(phone => {
                if (phone && typeof phone === 'object') {
                  this.selectedPhone = phone;
                  this.phoneDetailForm.patchValue(phone);
                }
              }),
              map(query => typeof query === 'object' ? (query as any)?.name : query),
              filter(query => !!query && typeof query !== 'object'),
              debounceTime(300),
              switchMap(modelName => this.phoneService.getPhones(modelName)))

      this.subscriptions.push(this.addPhoneForm.controls.userEmail
          .valueChanges.pipe(
              distinctUntilChanged(),
          debounceTime(300),
          switchMap(option => {
            if (typeof option === 'object') {
              return option;
            } else {
              this.userLoading = true;
              this.addPhoneForm.controls.donorPhoneNumber.disable({emitEvent: false})
              return this.userService.getUsersByEmail(option)
            }
          }),
          ).subscribe(users => {
            this.addPhoneForm.controls.donorPhoneNumber.enable({emitEvent: false})
            this.users = users as UserPayload[];
            this.userLoading = false;

            if (users.length === 1 && this.addPhoneForm.value.userEmail === users[0].email) {
              this.selectedUser = users[0];
              this.addPhoneForm.controls.donorPhoneNumber.patchValue(users[0].phoneNumber);
              // this.addPhoneForm.controls.donorPhoneNumber.disable({emitEvent: false});
            } else {
              this.selectedUser = null;
              this.addPhoneForm.controls.donorPhoneNumber.reset();
              // this.addPhoneForm.controls.donorPhoneNumber.enable({emitEvent: false});
            }
      }));
    }
  }

  generateImage() {
    const phoneData = this.addPhoneForm.value;
    if (phoneData && phoneData?.model) {
      const titleSplit = phoneData.model.split('(');
      this.isLoadingGeneration = true;
      if (this.selectedGenerationMethod === GenerationMethod.FAST) {
        this.imageGenerationService.generatePhoneImageFast(titleSplit[0]).subscribe();
      }
    }
  }

  sendPhoneForRecycling() {
    const phoneData = this.addPhoneForm.value;
    if (phoneData) {
        this.phoneQueueService.performRequest({
          phoneId: this.selectedPhone?.id,
          imei: phoneData.imei || 0,
          donorEmail: phoneData.userEmail || '',
          donorPhoneNumber: phoneData.donorPhoneNumber,
          visualCondition: this.mapNumberToAppeal(phoneData.visualCondition || 0),
          overtakenByEmail: this.authService.userData.email
        }, QueueFunction.RECYCLE_PHONE,
            {model: phoneData.model.model, imei: phoneData.imei || 0}, String(phoneData.imei), LoadingState.WRITING_INTO_BLOCKCHAIN);
      this.selectedPhone = null;
      this.addPhoneForm.controls.imei.setValue( null);
      this.addPhoneForm.controls.model.setValue( null);
      this.addPhoneForm.controls.phoneDetail.controls.model.reset();
      this.addPhoneForm.markAsUntouched();
      // this.addPhoneForm.reset();
    }
  }

  public mapNumberToAppeal(value: number): VisualAppeal {
    switch (value){
      case 0: return VisualAppeal.NON_FUNCTIONAL;
      case 1: return VisualAppeal.POOR;
      case 2: return VisualAppeal.FAIR;
      case 3: return VisualAppeal.GOOD;
      case 4: return VisualAppeal.NEW;
      default: return VisualAppeal.NON_FUNCTIONAL;
    }
  }
}
