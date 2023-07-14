import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleSelectionService } from 'src/app/private/service/role-selection/role-selection.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {UserRole} from '../../../../../../../../libs/shared_models/enum/user-role';
import {UserPayload} from '../../../../../../../../libs/shared_models/model/user-payload.model';
import { Web3Service } from 'src/app/private/service/web3/web3.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() routes: RouteInfo[] = [];
  menuItems: any[] = [];
  UserRole = UserRole;
  currentUser!: UserPayload;

  constructor(
    private web3: Web3Service,
    private roleSelectionService: RoleSelectionService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
      this.currentUser = this.authService.userData;
    this.menuItems = this.routes.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  public signOut() {
    this.authService.signOut();
}

  public connectWallet() {
    this.web3.connectAccount().then(response => {

  })
  }

  public resetRole() {
    this.roleSelectionService.resetRole();
    this.router.navigate(['private/select-role'])
  }
}
