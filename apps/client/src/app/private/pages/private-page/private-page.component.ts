import {Component, OnDestroy} from '@angular/core';
import {Location, ViewportScroller} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import {DrawerItem} from '../../service/drawer-items/model/drawer-item.model';
import {RoleSelectionService} from '../../service/role-selection/role-selection.service';
import {DrawerItemsService} from '../../service/drawer-items/drawer-items.service';
import {PhoneService} from '../../service/phone/phone.service';
import {ThemeService} from '../../service/theme/theme-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StatusChangeBarComponent} from '../../components/status-change-bar/status-change-bar.component';
import {RequestQueueService} from '../../service/phone/request-queue.service';
import {PhoneQueue} from '../../service/phone/model/phone-queue.model';
import {LoadingService} from '../../../loading.service';
import {filter, map, Observable, Subscription, tap} from 'rxjs';
import {PlatformType} from '../../../util/enum/platform-type.enum';
import {Capacitor} from '@capacitor/core';
import {AuthService} from '../../../shared/services/auth.service';
import {PlatformHelper} from '../../../util/platform.helper';
import { Web3Service } from '../../service/web3/web3.service';

@Component({
    selector: 'app-private-page',
    templateUrl: './private-page.component.html',
    styleUrls: ['./private-page.component.scss']
})
export class PrivatePageComponent implements OnDestroy{
    public routes: DrawerItem[] = [];
    public device: any;
    public ping$!: Subscription;
    public platform: PlatformType;
    PlatformType = PlatformType;
    public title$: Observable<string>;

    constructor(private roleSelectionService: RoleSelectionService,
                private drawerItemsService: DrawerItemsService,
                public phoneService: PhoneService,
                private themeService: ThemeService,
                public location: Location,
                private _snackBar: MatSnackBar,
                private phoneQueueService: RequestQueueService,
                public loadingService: LoadingService,
                private router: Router,
                private route: ActivatedRoute,
                private viewportScroller: ViewportScroller,
                private authService: AuthService,
                private web3: Web3Service,
    ) {
    }

    signOut() {
        this.authService.signOut();
    }
    ngOnDestroy() {
        // this.ping$.unsubscribe()
    }

    openSnackBar(phoneQueue: PhoneQueue): void {
        this._snackBar.openFromComponent(StatusChangeBarComponent, {
            duration: 5 * 1000,
            data: phoneQueue
        });
    }

    ngOnInit() {
        this.setupPlatform();
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((t) => {
            this.viewportScroller.scrollToPosition([0, 0]);
        });

        const role = this.roleSelectionService.getRole();
        this.phoneQueueService.phoneStateChange().subscribe(
            phoneQueue => this.openSnackBar(phoneQueue)
        )
        this.themeService.setTheme(role);
        this.routes = this.drawerItemsService.getAllRoutes();

        // perfect scrollbar

        if (!PlatformHelper.isMobile()) {
            // document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
            // const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            // const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            // let ps = new PerfectScrollbar(elemMainPanel);
            // ps = new PerfectScrollbar(elemSidebar);
        }
    }

    connectWallet() {
        this.web3.connectAccount().then(response => {
        })
    }

    setupPlatform() {
        this.platform = Capacitor.getPlatform() as PlatformType;
        //this.platform = PlatformType.IOS;//Capacitor.getPlatform() as PlatformType;
    }
}
