import {Component, Input} from '@angular/core';

@Component({
  selector: 'recykle-mono-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.scss'],
})
export class PhoneDetailComponent {
  @Input() phone!: any;
  @Input() visibleFields = ['model', 'state', 'imei', 'visualCondition', 'createdAt', 'company'];
}
