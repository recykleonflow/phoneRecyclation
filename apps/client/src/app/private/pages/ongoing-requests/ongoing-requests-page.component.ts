import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {LoadingState} from '../../service/phone/model/loading-state.enum';
import {PhoneQueue} from '../../service/phone/model/phone-queue.model';
import {MatTable} from '@angular/material/table';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import {PrintService} from '../../service/print/print.service';
import {PhoneService} from '../../service/phone/phone.service';
import {AuthService} from '../../../shared/services/auth.service';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';
import {QueueFunction} from '../../service/phone/queue-function.enum';

@Component({
    selector: 'recykle-mono-ongoing-requests',
    templateUrl: './ongoing-requests-page.component.html',
    styleUrls: ['./ongoing-requests-page.component.scss'],
})
export class OngoingRequestsPageComponent implements OnInit {
    @ViewChild(MatTable) table!: MatTable<PhoneQueue>;
    @Input() selectedRows: PhoneQueue[] = [];
    public isAdmin = false;
    public recyclationTransferStates = Object.keys(RecycleState).filter(state => state !== RecycleState.RECEIVED);

    RecycleState = RecycleState;
    get data(): PhoneQueue[] {
        return this.requestQueueService.requestQueue;
    }

    constructor(public requestQueueService: RequestQueueService,
                private printService: PrintService,
                private phoneService: PhoneService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.isAdmin = this.authService.userData.role === UserRole.ADMIN;
    }

    public afterSelection(selectedRows: PhoneQueue[]) {
        this.selectedRows = selectedRows;
    }

    public transferToState(state: RecycleState): void {
        this.requestQueueService.performMultipleRequests(this.selectedRows.map(row => ({state, ual: row.ual})),
            QueueFunction.CHANGE_STATE, this.selectedRows,
            this.selectedRows.map(row => row.id), LoadingState.WRITING_INTO_BLOCKCHAIN);
    }

    public printSelected() {
        const canvasElements: any[] = [];

        this.selectedRows.forEach((item, index) => {
            if (item.ual) {
                const canvas = document.getElementsByTagName('canvas')[index]
                this.printService.setImeiToQr(canvas, String(item.imei));
                canvasElements.push(document.getElementsByTagName('canvas')[index]);
            }
        });

        if (canvasElements.length > 0) {
            this.printService.print(canvasElements)
        }
    }
}
