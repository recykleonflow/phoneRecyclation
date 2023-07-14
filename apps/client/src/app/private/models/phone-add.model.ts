import {Phone} from './phone.model';
import {VisualAppeal} from '../enum/visual-state.enum';

export class PhoneAdd extends Phone {
    public imei: number;
    public donorEmail: string;
    public overtakenByEmail: string;
    public visualCondition: VisualAppeal;
    public donorPhoneNumber: string | undefined;

    constructor(imei: number, donorEmail: string, overtakenByEmail: string, visualCondition: VisualAppeal, donorPhoneNumber: string | undefined) {
        super();
        this.imei = imei;
        this.donorEmail = donorEmail;
        this.overtakenByEmail = overtakenByEmail;
        this.visualCondition = visualCondition;
        this.donorPhoneNumber = donorPhoneNumber;
    }
}
