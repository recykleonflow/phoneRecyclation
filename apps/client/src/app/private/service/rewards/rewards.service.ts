import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RewardPayload} from '../../../../../../../libs/shared_models/model/reward-payload.model';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RewardsService {

    constructor(private http: HttpClient) {}

    getUserRewards(userId: string): Observable<RewardPayload[]> {
        const params = new HttpParams().set('userId', userId);
        return this.http.get<RewardPayload[]>('/api/rewards', {params});
    }

    redeemReward(userId: string, rewardId: string): Observable<any> {
        const body = {userId: userId, rewardId: rewardId};
        return this.http.post<any>(`/api/rewards/redeem`,body);
    }
}
