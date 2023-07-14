import {PhoneType} from '../enum/phone-type.enum';

export class PhoneQuery {
    public type: PhoneType;
    public sort: string;
    public sortDirection: 'asc' | 'desc' | '';
    public pageIndex: number;
    public pageSize: number;
    public query?: string = '*'
}
