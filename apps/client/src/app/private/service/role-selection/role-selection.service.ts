import {Injectable} from '@angular/core';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';

@Injectable({
  providedIn: 'root'
})
export class RoleSelectionService {

  constructor() { }

  getRole(): UserRole | null {
    if (localStorage.getItem('role')) {
      return JSON.parse(localStorage.getItem('role')!);
    }
    return null;
  }

  setRole(role: UserRole): void {
    localStorage.setItem('role', JSON.stringify(role));
  }

  resetRole(): void {
    localStorage.removeItem('role');
  }

  hasRole(userRoles: UserRole[]): boolean {
    const currentUserRole = this.getRole();

    if (currentUserRole === UserRole.ADMIN) {
      return true;
    }

    if (currentUserRole) {
      return userRoles.includes(currentUserRole);
    }
    return false;

  }

}
