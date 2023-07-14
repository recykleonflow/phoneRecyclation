import {DisposableMethod} from '../../../../../../../../libs/shared_models/enum/disposable-method.enum';

export class PhoneDisposableDto {
    companyName: string = '';
    method: DisposableMethod = DisposableMethod.RECYCLED;
}
