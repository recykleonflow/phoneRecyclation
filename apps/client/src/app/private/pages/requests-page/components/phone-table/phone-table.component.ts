import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatSort, SortDirection} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {catchError, debounceTime, map, merge, Observable, of, startWith, switchMap} from 'rxjs';
import {UserPhoneSimple} from '../../../../../../../../../libs/shared_models/model/user-phones-simple.model';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {QrDialogComponent} from '../../../../components/qr-dialog/qr-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-phone-table',
  templateUrl: './phone-table.component.html',
  styleUrls: ['./phone-table.component.scss']
})
export class PhoneTableComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() public displayedColumns: string[] = ['imei', 'model', 'state','batteryExtracted', 'materialsExtracted',
      'createdAt', 'visualCondition',
      // 'ownerEmail',
      'handedOverAt', 'actions'];
  @Input() getPhones!: (sort: string, sortDirection: SortDirection, pageIndex: number, pageSize: number, query: string)
      => Observable<{totalCount: number, items: UserPhoneSimple[]}>;
  @Output() printQr = new EventEmitter<string>();
  @Output() downloadPhoneData = new EventEmitter<any>();
  @Output() loadingComplete = new EventEmitter<any>();

  public searchControl = new FormControl();
  public isLoadingResults: boolean = true;
  public data: any[] = [];
  public resultsLength: number = 0;
  public pageSize: number = 200;

    constructor(private router: Router) {

    }

    ngAfterViewInit() {

      if (this.paginator && this.sort) {
          // If the user changes the sort order, reset back to the first page.
          this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

          merge(this.sort.sortChange,
              this.paginator.page,
              this.searchControl.valueChanges.pipe(debounceTime(800))
          )
              .pipe(
                  startWith({}),
                  switchMap(() => {
                      //this.isLoadingResults = true;
                      return this.getPhones(
                          this.sort.active,
                          this.sort.direction,
                          this.paginator.pageIndex,
                          this.paginator.pageSize,
                          this.searchControl.value
                      ).pipe(catchError(() => of(null)));
                  }),
                  map(data => {
                      // Flip flag to show that loading has finished.
                      //this.isLoadingResults = false;
                      this.loadingComplete.emit();

                      if (data === null) {
                          return [];
                      }

                      // Only refresh the result length if there is new data. In case of rate
                      // limit errors, we do not want to reset the paginator to zero, as that
                      // would prevent users from re-triggering requests.
                      this.resultsLength = data.totalCount;
                      return data.items;
                  }),
              )
              .subscribe(data => (this.data = data));
      }
  }

    public onPrintQr(ual: string) {
      this.printQr.next(ual);
    }

    public openHistory(ual: string) {
      this.router.navigate([`private/phone/${window.btoa(ual)}`])
    }

    public downloadInfo(phoneData: any) {
      this.downloadPhoneData.next(phoneData);
    }
}
