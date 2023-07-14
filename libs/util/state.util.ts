import {RecycleState} from '../shared_models/enum/recycleState';

export class StateUtil {
    static isValidState(value: string): boolean {
        return Object.values(RecycleState).includes(value as RecycleState);
    }
}
