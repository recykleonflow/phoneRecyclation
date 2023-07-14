import {LoadingState, LoadingTypeState} from './loading-state.enum';
import {RecycleState} from '../../../../../../../../libs/shared_models/enum/recycleState';
import {Observable} from 'rxjs';
import {QueueFunction} from '../queue-function.enum';

export class PhoneQueue<B = any, R = any> {
    public id: string;
    public state: LoadingState = LoadingState.LOADING;
    public ual: string | null;
    public requestBody: B | null;
    public imei: number | null | string;
    public model?: string;
    public recyclationState!: RecycleState;
    public queueFunction!: QueueFunction;
    public response!: R | null;
    public loadingType!: LoadingTypeState;

    constructor(state: LoadingState, ual: string | null, requestBody: B | null,
                id: string, imei: number | null, recyclationState: RecycleState, queueFunction: QueueFunction) {
        this.state = state;
        this.ual = ual;
        this.requestBody = requestBody;
        this.id = id;
        this.imei = imei;
        this.recyclationState = recyclationState;
        this.response = null;
        this.queueFunction = queueFunction;
    }
}
