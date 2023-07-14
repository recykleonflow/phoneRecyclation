import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {RecycleState} from '../../../../../../../../../libs/shared_models/enum/recycleState';


@Component({
  selector: 'recykle-mono-state-lifecycle',
  templateUrl: './state-lifecycle.component.html',
  styleUrls: ['./state-lifecycle.component.scss'],
})
export class StateLifecycleComponent implements AfterViewInit {
  @ViewChild('stateElement', {static: true}) stateElement!: ElementRef;
  @Input() state!: RecycleState;
  public recyclationStates: string[] = [RecycleState.RECEIVED,RecycleState.IN_TRANSIT,RecycleState.AT_RECYCLING_COMPANY, RecycleState.RECYCLED];
  public selectedIndex = 0;
  selectedIndexes: number[] = [];
  recyclationIcons = ['store', 'local_shipping', 'factory', 'eco']

  ngAfterViewInit(): void {
    this.stateElement.nativeElement.style.setProperty('--final-color','#82d598');
    if (this.state === RecycleState.REFURBISHED || this.state === RecycleState.RESOLD) {
      this.recyclationStates[3] = this.state;
      this.recyclationIcons[3] = 'build';
      this.selectedIndex = 3;
      this.stateElement.nativeElement.style.setProperty('--final-color','#e79441');
    }
    else {
      this.selectedIndex = this.recyclationStates.indexOf(this.state);
    }
    this.setSelectedValues();
  }

  private async setSelectedValues() {
    for (let i = 0; i <= this.selectedIndex; i++) {
      await setTimeout(() => {
        this.selectedIndexes.push(i);
      }, i * 300)
    }
  }
}
