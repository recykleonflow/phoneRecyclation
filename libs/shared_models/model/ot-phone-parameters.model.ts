import {VisualAppeal} from '../enum/visual-state.enum';
import {RecycleState} from '../enum/recycleState';
import {DisposableMethod} from '../enum/disposable-method.enum';
import {SimpleRequestPhone} from './simple-request-phone.model';

export class OtPhoneParametersModel {
    imei!: string;
    phoneIpfs!: string;
    backgroundIpfs!: string;
    compositeIpfs!: string;
    metadataIpfs!: string;
    id: string;
    brand: string;
    model: string;
    owner: string;
    batteryExtracted: boolean;
    materialsExtracted: boolean;
    visualCondition: VisualAppeal;
    location?: {
        name: string;
        latitude: string;
        longitude: string;
    };
    state: RecycleState;
    factory?: string;
    technicalSpecification: {
        processor: string;
        ram: number;
        storage: string;
    };
    handover: {
        date: string;
        email: string;
        company: string;
    };
    disposal?: {
        name: string;
        method: DisposableMethod;
        latitude: string;
        longitude: string;
        email: string;
    };
    createdAt: string;
}
