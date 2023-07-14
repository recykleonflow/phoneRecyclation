import {Injectable} from '@angular/core';
import {PhoneQueue} from './model/phone-queue.model';
import {PhoneService} from './phone.service';
import {QueueFunction} from './queue-function.enum';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class QueueFunctionsService {

    constructor(private phoneService: PhoneService) {}

    performFunction(queue: PhoneQueue): Observable<any> {
        switch(queue.queueFunction){
            case QueueFunction.GET_PHONE_BY_QR: {
                return this.phoneService.getPhoneByQrCode(queue.requestBody)
            }
            case QueueFunction.RECYCLE_PHONE: {
                return this.phoneService.recyclePhone(queue.requestBody)
            }
            case QueueFunction.CHANGE_STATE: {
                return this.phoneService.changePhoneState(queue.requestBody)
            }
        }

    }
}
