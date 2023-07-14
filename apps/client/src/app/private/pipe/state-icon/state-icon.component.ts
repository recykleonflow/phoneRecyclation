import {Component, Input} from '@angular/core';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';

@Component({
  selector: 'recykle-mono-state-icon',
  templateUrl: './state-icon.component.html',
  styleUrls: ['./state-icon.component.scss'],
})
export class StateIconComponent {
  @Input() state!: RecycleState;

  public finalStates = [RecycleState.RESOLD, RecycleState.REFURBISHED, RecycleState.RECYCLED]
  public recyclationIcons =
    {[RecycleState.RECEIVED]: 'store',
      [RecycleState.IN_TRANSIT]: 'local_shipping',
      [RecycleState.AT_RECYCLING_COMPANY]:'factory',
      [RecycleState.RESOLD]: 'eco',
      [RecycleState.REFURBISHED]: 'eco',
      [RecycleState.RECYCLED]: 'build'
    }
}
