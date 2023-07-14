import {VisualAppeal} from '../../../../../libs/shared_models/enum/visual-state.enum';

export class PhoneHandoverDto {
    public phoneId: string;
    public imei: string;
    public donorEmail: string;
    public overtakenByEmail: string;
    public visualCondition: VisualAppeal;
    public donorPhoneNumber: string;
}
