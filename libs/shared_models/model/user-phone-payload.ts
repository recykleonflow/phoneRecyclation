import { RecycleState } from '../enum/recycleState';
import {VisualAppeal} from '../enum/visual-state.enum';
import { NftDataPayload } from './nft-data-payload';

export class UserPhonePayload {
    ual: string;
    imei: string;
    model: string;
    title: string;
    state: RecycleState;
    ownerEmail: string;
    visualCondition: VisualAppeal;
    handedOverAt: Date;
    donorPhoneNumber: string;
    phoneUrl: string;
    nftData: NftDataPayload;
    createdAt: string;
    batteryExtracted: boolean;
    materialsExtracted: boolean;
}
