import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {UserRole} from '../../../../../../libs/shared_models/enum/user-role';
import {RoleSelectionService} from '../../private/service/role-selection/role-selection.service';

@Injectable({
  providedIn: 'root',
})
export class IsRoleAuthorizedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private roleSelectionService: RoleSelectionService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const neededRoles = next.data['roles'] ?? [];

    if (neededRoles) {

      const canAccess = this.roleSelectionService.hasRole(neededRoles)
      // if (!canAccess && !this.authService.userData.emailVerified) {
        // this.dialog.open(NotAuthorizedDialogComponent);
        // this.router.navigate(['/private']);
        // this.router.navigate(['/private/unauthorized']);
      // }
      return true;
    }
    return true;
  }
}
