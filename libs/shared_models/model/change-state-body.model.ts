import {RecycleState} from '../enum/recycleState';

export class ChangeStateBody {
    state!: RecycleState;
    batteryExtracted!: boolean;
    materialsExtracted!: boolean
}
