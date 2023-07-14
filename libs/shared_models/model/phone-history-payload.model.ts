import {RecycleState} from '../enum/recycleState';
import {VisualAppeal} from '../enum/visual-state.enum';

export class PhoneHistoryPayload {
    imei!: string;
    "locationName": string;
    "locationLatitude": string;
    "brand": string;
    "model": string;
    "factory": string;
    "technicalSpecifications": string;
    "phone": string;
    "handoverDate": string;
    "state": RecycleState;
    "owner": string;
    "handoverEmail": string;
    "handoverCompany": string;
    "locationLongitude": string;
    "createdAt": string;
    "visualCondition": VisualAppeal;
}
