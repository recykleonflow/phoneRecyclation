export class DkgResult<T> {
    status: 'COMPLETED' | string;
    data: T[];
}
