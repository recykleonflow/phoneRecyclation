import { Injectable } from '@angular/core';
import {PhoneModel} from '../add-device/model/phoneModel.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhoneDataService {

  phones: PhoneModel[] = [
    {
      id: '1',
      label: 'Nokia 3310'
    },
    {
      id: '2',
      label: 'Samsung S21'
    },
    {
      id: '3',
      label: 'Sony express 32'
    },
    {
      id: '4',
      label: 'Apple Iphone 4S'
    },
    {
      id: '5',
      label: 'Motorola L3'
    },
    {
      id: '6',
      label: 'LG S12'
    },
  ]
  constructor() { }

  getPhonesByModelName(name: string | null): Observable<PhoneModel[]> {
    if (typeof name !== 'object') {
      if (name) {
        return of(this.phones.filter(phone => phone.label.toLowerCase().includes(name?.toLowerCase())))
      } else {
        return of(this.phones)
      }
    } else {
      return of([]);
    }
  }
}
