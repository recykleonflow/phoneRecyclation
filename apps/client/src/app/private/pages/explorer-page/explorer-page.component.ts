import {Component} from '@angular/core';
import {PhoneService} from '../../service/phone/phone.service';
import {SortDirection} from '@angular/material/sort';
import {QrDialogComponent} from '../../components/qr-dialog/qr-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {RoleSelectionService} from '../../service/role-selection/role-selection.service';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {LoadingState} from '../../service/phone/model/loading-state.enum';
import {UserPhoneSimple} from '../../../../../../../libs/shared_models/model/user-phones-simple.model';
import {QueueFunction} from '../../service/phone/queue-function.enum';
import { LoadingService } from 'src/app/loading.service';

@Component({
    selector: 'app-explorer-page',
    templateUrl: './explorer-page.component.html',
    styleUrls: ['./explorer-page.component.scss']
})
export class ExplorerPageComponent {
    public loadingText = 'Retrieving explorer data...';

    constructor(
                public loadingService: LoadingService,
                private phoneService: PhoneService,
                private matDialog: MatDialog,
                private roleSelectionService: RoleSelectionService,
                private requestQueueService: RequestQueueService) {}

    public getQueriedPhones = (sort: string, sortDirection: SortDirection, pageIndex: number, pageSize: number, query: string) => {
        this.loadingService.isToolbarLoading = true;
        const result = this.phoneService.queryPhones(sort, sortDirection, pageIndex, pageSize, query);
        return result;
    }

    loadingComplete() {
        this.loadingService.isToolbarLoading = false;
    }

    downloadPhoneData(phone: UserPhoneSimple): void {
        this.requestQueueService.performRequest(phone.ual,
            QueueFunction.GET_PHONE_BY_QR,
            {ual: phone.ual, imei: phone.imei}, phone.ual, LoadingState.READING_FROM_BLOCKCHAIN);
    }

    printQr(ual: string): void {
        this.matDialog.open(QrDialogComponent, {data: ual})
    }

}
