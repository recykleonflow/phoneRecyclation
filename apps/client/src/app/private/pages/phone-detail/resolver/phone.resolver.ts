import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Observable, tap} from 'rxjs';
import {PhoneService} from '../../../service/phone/phone.service';
import {LoadingService} from '../../../../loading.service';

@Injectable({
  providedIn: 'root',
})
export class PhoneResolver implements Resolve<any> {
  constructor(private phoneService: PhoneService, private loadingService: LoadingService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.loadingService.isLoading = true;
    const imei = window.atob(route.params['ual']);

    return this.phoneService.getPhoneHistoryByUal(imei)
        .pipe(tap(() => this.loadingService.isLoading = false));
  }
}
