import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {PhoneQueue} from '../../service/phone/model/phone-queue.model';
import { LoadingState } from '../../service/phone/model/loading-state.enum';
import { RecycleState } from '../../../../../../../libs/shared_models/enum/recycleState';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {PrintService} from '../../service/print/print.service';
import {Router} from '@angular/router';
import {MatTable} from '@angular/material/table';

@Component({
  selector: 'recykle-mono-ongoing-requests-table',
  templateUrl: './ongoing-requests-table.component.html',
  styleUrls: ['./ongoing-requests-table.component.scss'],
})
export class OngoingRequestsTableComponent implements OnInit, OnChanges {
  @ViewChild(MatTable) table!: MatTable<PhoneQueue>;
  @Input() data!: PhoneQueue[];
  @Output() afterSelection = new EventEmitter<PhoneQueue[]>();

  LoadingState = LoadingState;
  displayedColumns = ['select', 'imei', 'model', 'state', 'loadingState', 'action']
  selection = new SelectionModel<PhoneQueue>(true, []);
  RecyclationState = RecycleState;

  constructor(public phoneQueueService: RequestQueueService,
              private printService: PrintService,
              private router: Router) {}

  public deselect() {
    this.selection.clear();
  }

  ngOnInit() {
    this.phoneQueueService.phoneStateChange().subscribe(
        () => {
          this.table?.renderRows()
        });

    this.selection.changed.subscribe(() =>  this.afterSelection.next(this.selection.selected))
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.deselectLoadingRows();
    }
  }

  public deselectLoadingRows() {
    const dataToUnselectSelect = this.selection.selected.filter(selection => selection.state !== LoadingState.COMPLETE);
    this.selection.select(...dataToUnselectSelect);
  }

  public retry(phoneQueue: PhoneQueue): void {
    this.phoneQueueService.retry(phoneQueue);
  }

  public removeFromQueue(phoneQueue: PhoneQueue) {
    this.phoneQueueService.remove(phoneQueue);
  }

  public openDetail(phoneQueue: PhoneQueue): void {
    if (phoneQueue.ual) {
      this.router.navigate([`private/phone/${window.btoa(phoneQueue.ual)}`])
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataToSelect().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    const dataToSelect = this.dataToSelect();
    this.selection.select(...dataToSelect);
  }

  dataToSelect() {
    const dataToSelect = this.data.filter(item => item.state === LoadingState.COMPLETE);
    return dataToSelect || [];
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PhoneQueue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}
