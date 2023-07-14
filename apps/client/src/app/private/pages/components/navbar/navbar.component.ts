import {Component, OnInit, ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {RoleSelectionService} from 'src/app/private/service/role-selection/role-selection.service';
import {DrawerItemsService} from 'src/app/private/service/drawer-items/drawer-items.service';
import {Web3Service} from '../../../service/web3/web3.service';
import {BehaviorSubject, from, map, Observable, Subject} from 'rxjs';
import {UserRole} from '../../../../../../../../libs/shared_models/enum/user-role';
import {UserPayload} from '../../../../../../../../libs/shared_models/model/user-payload.model';
import { LoadingService } from 'src/app/loading.service';
import { FlowService } from 'src/app/private/service/flow/flow-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public roles = UserRole;
    public loggedInUser!: UserPayload | null;
    public currentRole: UserRole | null = null;
    private listTitles: any[] = [];
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public connectedAccount$: BehaviorSubject<string> = new BehaviorSubject('');
    UserRole = UserRole;

    constructor(
        public flowService: FlowService,
        public loadingService: LoadingService,
        private roleSelectionService: RoleSelectionService,
        private drawerItemsService: DrawerItemsService,
        public authService: AuthService,
        private web3: Web3Service,
        private location: Location,
        private element: ElementRef,
        private router: Router) {
        this.sidebarVisible = false;
    }

    public signOut() {
        this.authService.signOut();
    }

    public resetRole() {
        this.roleSelectionService.resetRole();
        this.router.navigate(['private/select-role'])
    }

    disconnect() {
        this.flowService.logout();
        this.connectedAccount$.next('');
    }

    connect() {
        this.flowService.login();
        this.flowService.getCurrentUser().subscribe((user: any) => {
            this.connectedAccount$.next(user.addr);
        })
    }

    ngOnInit() {
        this.currentRole = this.roleSelectionService.getRole();
        this.loggedInUser = this.authService.userData;
        this.listTitles = this.drawerItemsService.getAllRoutes().filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        let $layer: any = null;
        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = () => { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            };

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
}
