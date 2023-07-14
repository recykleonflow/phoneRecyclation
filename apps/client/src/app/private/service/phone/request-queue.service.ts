import {Injectable} from '@angular/core';
import {concatMap, from, Observable, Subject} from 'rxjs';
import {PhoneQueue} from './model/phone-queue.model';
import {LoadingState, LoadingTypeState} from './model/loading-state.enum';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import {LiveUpdateService} from '../../../shared/services/live-update/live-update.service';
import {UpdatedEntityType} from '../../../shared/services/live-update/updated-entity.enum';
import {QueueFunction} from './queue-function.enum';
import {QueueFunctionsService} from './queue-functions.service';


@Injectable({
    providedIn: 'root'
})
export class RequestQueueService {

    private phoneQueueChange$ = new Subject<PhoneQueue<any, any> | null>();
    public requestQueue: PhoneQueue<any, any>[] = [];

    constructor(private liveUpdateService: LiveUpdateService,
                private queueFunctionsService: QueueFunctionsService) {

        this.phoneQueueChange$.subscribe(queue =>
            this.liveUpdateService.performUpdate(UpdatedEntityType.QUEUE, this.requestQueue));

        this.liveUpdateService.onUpdate<PhoneQueue[]>(UpdatedEntityType.QUEUE).subscribe(
            queue => this.requestQueue = queue
        )
    }

    public remove(phoneQueue: PhoneQueue): void {
        this.requestQueue = this.requestQueue.filter(queue => queue !== phoneQueue);
        this.phoneQueueChange$.next(null);
    }

    public phoneStateChange(): Observable<PhoneQueue<any, any> | null> {
        return this.phoneQueueChange$.asObservable();
    }

    public performMultipleRequests(requestData: any[], queueFunction: QueueFunction, phoneQueueData: Partial<PhoneQueue<any, any>>[], ids: string[],
                                   loadingType: LoadingTypeState): void {

        this.requestQueue = this.requestQueue.map(
            request => {
                if(ids.includes(request.id)) {
                    request.state = LoadingState.PENDING;

                }
                return request;
            }
        );

        from(requestData.map( (r, index) => index)).pipe(
            concatMap(
                (iteration) => this.performRequest(requestData[iteration],
                    queueFunction,
                    phoneQueueData[iteration], ids[iteration], loadingType)
            )).subscribe()
    }

    public performRequest(requestData: any, queueFunction: QueueFunction, phoneQueueData: Partial<PhoneQueue<any, any>>, id: string,
                          loadingType: LoadingTypeState): Observable<void> {
        const finish = new Subject<void>();

        const existingRequest = this.requestQueue.find(request => request.id === id);

        if (!existingRequest
            || existingRequest.state === LoadingState.COMPLETE
            || existingRequest.state === LoadingState.PENDING) {
            let phoneQueue: PhoneQueue;
            if (existingRequest) {
                existingRequest.loadingType = loadingType;
                existingRequest.state = loadingType;
                existingRequest.queueFunction = queueFunction;
                existingRequest.requestBody = requestData;
                phoneQueue = existingRequest;

                this.requestQueue = this.requestQueue.map(request => {
                    if (request.id === existingRequest.id) {
                        return existingRequest;
                    } else {
                        return request;
                    }
                })
            } else {
                phoneQueue = {
                    ...new PhoneQueue(loadingType, null, requestData, id, null, RecycleState.RECEIVED, queueFunction),
                    ...phoneQueueData,
                    loadingType
                };
                this.requestQueue.reverse().push(phoneQueue);
                this.requestQueue.reverse();
            }

            this.queueFunctionsService.performFunction(phoneQueue).subscribe({
                next: (result) => {this.updateRequestQueue(phoneQueue, LoadingState.COMPLETE, result.ual, result); finish.complete();},
                error: () => {this.updateRequestQueue(phoneQueue, LoadingState.ERROR, phoneQueue.ual, phoneQueue.response); finish.complete();}
            })
            this.phoneQueueChange$.next(phoneQueue);
            return finish.asObservable();
        }
        return new Observable<void>();
    }

    retry(phoneQueue: PhoneQueue<any, any>): void {
        this.updateRequestQueue(phoneQueue, phoneQueue.loadingType,null);
        this.queueFunctionsService.performFunction(phoneQueue).subscribe({
            next: (result) => this.updateRequestQueue(phoneQueue, LoadingState.COMPLETE, result?.ual),
            error: () => this.updateRequestQueue(phoneQueue, LoadingState.ERROR, null),
        })
    }

    private updateRequestQueue(phoneQueue: PhoneQueue<any, any>, loadingState: LoadingState, ual: string | null, response?: any | null): void {
        this.requestQueue = this.requestQueue.map(phoneQueueFromArray => {
            if (phoneQueueFromArray.id === phoneQueue.id) {
                const updatedPhoneRequest = {...phoneQueue, state: loadingState, ual: ual ?? phoneQueue.ual, imei: response?.imei ?? phoneQueue.imei, response};
                this.phoneQueueChange$.next(updatedPhoneRequest);
                return updatedPhoneRequest;
            } else {
                return phoneQueueFromArray;
            }
        })

        this.phoneQueueChange$.next(phoneQueue);
    }
}
