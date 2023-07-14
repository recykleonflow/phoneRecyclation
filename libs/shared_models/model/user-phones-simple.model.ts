import {VisualAppeal} from '../enum/visual-state.enum';
import {SimpleRequestPhone} from './simple-request-phone.model';

export class UserPhoneSimple extends SimpleRequestPhone{
    phone: string;
    title: string;
    ownerEmail: string;
    visualCondition: VisualAppeal;
    handedOverAt: Date;
    donorPhoneNumber: string;
    phoneIpfs: string;
    backgroundIpfs: string;
    compositeIpfs: string;
    metadataIpfs: string;
    batteryExtracted: boolean;
    materialsExtracted: boolean;
}
