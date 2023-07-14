import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {PhoneQueue} from '../../service/phone/model/phone-queue.model';
import {RoleSelectionService} from '../../service/role-selection/role-selection.service';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';

@Component({
  selector: 'recykle-mono-status-change-bar',
  templateUrl: './status-change-bar.component.html',
  styleUrls: ['./status-change-bar.component.scss'],
})
export class StatusChangeBarComponent implements OnInit{
  snackBarRef = inject(MatSnackBarRef);
  role!: UserRole;
  UserRole = UserRole;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: PhoneQueue,
              private roleSelectionService: RoleSelectionService) {
  }

  ngOnInit() {
    this.role = this.roleSelectionService.getRole() as UserRole;
  }
}
