import {Component, OnInit} from '@angular/core';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';
import {RoleSelectionService} from '../../service/role-selection/role-selection.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-role-selection-page',
    templateUrl: './role-selection-page.component.html',
    styleUrls: ['./role-selection-page.component.scss']
})
export class RoleSelectionPageComponent implements OnInit {

    roles: { role: UserRole, icon: string, name: string }[];

    constructor(private roleSelectionService: RoleSelectionService, private router: Router) {
        this.roles = [
            {
                role: UserRole.CLIENT,
                icon: 'person',
                name: 'Client',
            },
            {
                role: UserRole.EMPLOYEE,
                icon: 'badge',
                name: 'Employee',
            },
            {
                role: UserRole.RECYCLE_COMPANY,
                icon: 'factory',
                name: 'Recycle Factory',
            }]
    }

    ngOnInit() {

    }

    selectRole(role: UserRole): void {
        this.roleSelectionService.setRole(role);
        this.router.navigate(['private']);
    }

    getPathByRole(role: UserRole | null) {
        switch (role) {
            case UserRole.CLIENT: return 'private/loading';
            case UserRole.EMPLOYEE: return 'private/add-device';
            case UserRole.RECYCLE_COMPANY: return 'private/requests';
        }
        return null;
    }
}
