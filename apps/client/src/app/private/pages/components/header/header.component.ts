import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {RoleSelectionService} from '../../../service/role-selection/role-selection.service';
import {Router} from '@angular/router';
import {PhoneService} from '../../../service/phone/phone.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    loggedInUserFromBe: string | null = null;

    constructor(public authService: AuthService,
                private phoneService: PhoneService,
                private roleSelectionService: RoleSelectionService,
                private router: Router) {
    }

    ngOnInit() {
        // this.phoneService.getDevices().subscribe(user => {
        //     this.loggedInUserFromBe = user.email;
        //     console.log(user)
        // });
    }

    public signOut() {
        this.authService.signOut();
    }

    public resetRole() {
        this.roleSelectionService.resetRole();
        this.router.navigate(['private/select-role'])
    }
}
