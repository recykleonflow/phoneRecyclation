import {Component, Input} from '@angular/core';
import { LoadingService } from 'src/app/loading.service';

@Component({
    selector: 'app-toolbar-loader',
    templateUrl: './toolbar-loader.component.html',
    styleUrls: ['./toolbar-loader.component.scss']
})
export class ToolbarLoaderComponent {
    @Input() text: string = 'Retrieving blockchain data...';

    constructor(public loadingService: LoadingService) {
    }
}
