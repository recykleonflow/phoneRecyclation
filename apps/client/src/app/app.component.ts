import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/services/auth.service';
import {BarcodeScanner, SupportedFormat} from '@capacitor-community/barcode-scanner';
import {Capacitor} from '@capacitor/core';
import {PlatformType} from './util/enum/platform-type.enum';
import {PlatformHelper} from './util/platform.helper';
import {LiveUpdateService} from './shared/services/live-update/live-update.service';
import {v4 as uuid} from 'uuid';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'recykle-fe';

    ngOnInit() {
        // LiveUpdateService.sessionId = uuid();
    }

    constructor(public authService: AuthService) {
        PlatformHelper.platform = Capacitor.getPlatform() as PlatformType;
       this.testScanner();
    }

    private async testScanner() {
        if (PlatformHelper.isMobile()) {
            // (DeviceMotionEvent as any).requestPermission();
            // DeviceMotionEvent.requestPermission();
            // document.querySelector('body').classList.add('scanner-active');
            // BarcodeScanner.hideBackground();
            // const result = await BarcodeScanner.startScan({targetedFormats: [SupportedFormat.QR_CODE]});
            // if (result.hasContent) {
            //     // this.onScan(result.content);
            //     console.log(result.content);
            // }
        }
    }


}
