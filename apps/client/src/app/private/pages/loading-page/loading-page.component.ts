import {Component} from '@angular/core';
import {LoadingService} from '../../../loading.service';

@Component({
    selector: 'app-loading-page',
    templateUrl: './loading-page.component.html',
    styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent {

    constructor(public loadingService: LoadingService) {
    }
}
