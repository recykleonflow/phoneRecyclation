import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, from, map, Observable, of, shareReplay, startWith, switchMap, tap} from 'rxjs';
import {Phone} from '../../models/phone.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {PhoneAdd} from '../../models/phone-add.model';
import {SortDirection} from '@angular/material/sort';
import {PhoneType} from '../../../../../../../libs/shared_models/enum/phone-type.enum';
import {PaginatedResult} from '../../../../../../../libs/shared_models/model/paginated-result.model';
import {UserPhoneSimple} from '../../../../../../../libs/shared_models/model/user-phones-simple.model';
import {UalPhoneMapperUtil} from '../../../../../../../libs/util/ual-phone-mapper.util';
import {OtPhoneParametersModel} from '../../../../../../../libs/shared_models/model/ot-phone-parameters.model';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import {PhonePayload} from '../../../../../../../libs/shared_models/model/phone-payload.model';
import {LoadingService} from '../../../loading.service';
import {PhoneHistoryPayload} from '../../../../../../../libs/shared_models/model/phone-history-payload.model';
import {UserPhonePayload} from '../../../../../../../libs/shared_models/model/user-phone-payload';
import {LiveUpdateService} from '../../../shared/services/live-update/live-update.service';
import {UpdatedEntityType} from '../../../shared/services/live-update/updated-entity.enum';
import {ChangeStateBody} from '../../../../../../../libs/shared_models/model/change-state-body.model';

import * as moment from 'moment';

const PHONES = 'phones';
const PHONE_DETAIL = 'PHONE_DETAIL';

@Injectable({
    providedIn: 'root'
})
export class PhoneService {

    public myPhones: UserPhoneSimple[] = [];
    public phones$: Observable<any>;
    public statistics: any;

    constructor(private http: HttpClient,
                public firestore: AngularFirestore,
                private loadingService: LoadingService,
                private liveUpdateService: LiveUpdateService) {
    }

    getMaterials(phoneImeis: string[]): Observable<{[material: string]: number}> {
        return this.http.post<{[material: string]: number}>('/api/phone/materials', phoneImeis);
        // return of({
        //     'aluminium': 200
        // })
    }

    revealPhoneNFT(ual: string) {
        const params = new HttpParams().set('ual', ual);
        return this.http.get<any>(`/api/phone/reveal-nft`, {params}).pipe(
            tap(() => this.liveUpdateService.performUpdate(UpdatedEntityType.PHONE, {time: new Date()}, true)),
            // todo: remove, quick fix for mobile phone it was returning error
            catchError(() => this.liveUpdateService.performUpdate(UpdatedEntityType.PHONE, {time: new Date()}, true))
        );
    }

    claimPhoneNFT(ual: string) {
        const params = new HttpParams().set('ual', ual);
        return this.http.get<any>(`/api/phone/claim-nft`, {params});
    }

    getPhoneHistoryByImei(ual: string): Observable<PhoneHistoryPayload[]> {
        const params = new HttpParams().set('imei', ual);
        return this.http.get<{ data: PhoneHistoryPayload[] }>('/api/phone/history/imei', {params})
            .pipe(
                map((result) => result.data),
            );
    }

    getPhoneHistoryByUal(ual: string): Observable<PhoneHistoryPayload[]> {
        const params = new HttpParams().set('ual', ual);
        return this.http.get<PhoneHistoryPayload[]>('/api/phone/history', {params});
    }

    setStatistics(statistics: any) {
        this.statistics = statistics;
    }

    getStatistics(): Observable<{
        stateStatistics: {state: RecycleState, count: number}[], 
        countsByBrands: {brand: string, count: number}[],
        summedMaterials: {material: string, sum: number}[],
    }> {
        return this.http.get<any>('/api/phone/statistics');
    }

    // setMyPhones(phones: UserPhoneSimple[]) {
    //     this.myPhones = phones.map(x => {
    //         x.nftData = new NftData(Number(x.imei), x.model);
    //         return x;
    //     });
    //     //this.myPhones = this.getMockPhones();
    // }

    public recyclePhone(phoneDetails: PhoneAdd) {
        return this.http.post<{ ual: string }>('/api/phone', phoneDetails);
    }

    public checkImei(imei: number): Observable<{ isUsed: boolean }> {
        const params = new HttpParams().set('imei', imei);
        return this.http.get<{ isUsed: boolean }>('/api/phone/check-imei', {params});
    }

    getPhones(queryText: string): Observable<PhonePayload[]> {
        const params = new HttpParams().set('query', queryText);
        // return new Promise<any>((resolve) => {
        //     return this.firestore.collection<Phone>(PHONES,
        //         ref => ref
        //             .orderBy('title')
        //             .startAt(queryText)
        //             .endAt(queryText + '\uf8ff')
        //             .limit(50))
        //         .valueChanges()
        //         .subscribe(products => resolve(products.map(product => this.mapPhone(product))))
        // })
        return this.http.get<PhonePayload[]>('/api/phone/models', {params})
    }

    getHandedOverPhones(): Observable<PaginatedResult<UserPhonePayload>> {
        const params = new HttpParams().set('type', PhoneType.MINE);
        if (!this.phones$) {
            this.loadingService.isToolbarLoading = true;
            this.phones$ = this.liveUpdateService.onUpdate(UpdatedEntityType.PHONE).pipe(
                startWith({}),
                tap(() => this.loadingService.isToolbarLoading = true),
                switchMap(() =>
                    this.http.get<PaginatedResult<UserPhoneSimple>>('/api/phone', {params}).pipe(
                    tap(() => { 
                        this.loadingService.isLoading = false; 
                        this.loadingService.isToolbarLoading = false; 
                    }),
                        map(data => {
                            return {
                                ...data,
                                items: data.items.reverse()
                            }
                        })
                )),  shareReplay());
        }
        return this.phones$;
    }

    queryPhones(activeSort: string, sortDirection: SortDirection, pageIndex: number, pageSize: number, query: string): Observable<PaginatedResult<UserPhoneSimple>> {
        const params = new HttpParams()
            .set('type', PhoneType.ALL)
            .set('sort', activeSort)
            .set('query', query)
            .set('sortDirection', sortDirection)
            .set('pageIndex', pageIndex)
            .set('pageSize', pageSize);
        return this.http.get<PaginatedResult<UserPhoneSimple>>('/api/phone', {params});
    }

    getProcessedPhones(activeSort: string, sortDirection: SortDirection, pageIndex: number, pageSize: number): Observable<PaginatedResult<UserPhoneSimple>> {
        const params = new HttpParams()
            .set('sort', activeSort)
            .set('sortDirection', sortDirection)
            .set('pageIndex', pageIndex)
            .set('pageSize', pageSize);
        return this.http.get<PaginatedResult<UserPhoneSimple>>('/api/phone/processed', {params});
    }

    // addDisposableToPhone(disposableDto: PhoneDisposableDto, imei: string): Observable<void> {
    //     const httpParams = new HttpParams().set('ual', imei);
    //     return this.http.post<void>('/api/phone/recycle', disposableDto, {params: httpParams});
    // }

    changePhoneState({state, ual, batteryExtracted, materialsExtracted}: ChangeStateBody & {ual: string}): Observable<OtPhoneParametersModel> {
        const httpParams = new HttpParams().set('ual', ual);
        return this.http.post<OtPhoneParametersModel>('/api/phone/state',
            {state, batteryExtracted, materialsExtracted}, {params: httpParams});
    }

    getPhoneByQrCode(qrCode: string): Observable<OtPhoneParametersModel> {
        let params = new HttpParams();
        params = params.set('ual', qrCode).set('setState', RecycleState.AT_RECYCLING_COMPANY);

        return this.http.get<any>('/api/phone/recycle', {params});
    }

    private mapPhone(phone: Phone): Phone {
        return {
            ...phone,
            model_list:
                phone.models
                    .replaceAll('[', '')
                    .replaceAll(']', '')
                    .split(',')
        }
    }
}
