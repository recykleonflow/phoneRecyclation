import * as moment from 'moment';

export class OtHelper {
    public static generateOtDate() {
        return moment().format("YYYY-MM-DDTHH:MM:SS")
    }
}
