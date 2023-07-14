import { Injectable } from '@angular/core';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  setTheme(role: UserRole | null) {
    switch (role) {
        case UserRole.CLIENT:
            document.body.classList.remove('retail');
            document.body.classList.remove('default');
            document.body.classList.add('user');
            break;
        case UserRole.EMPLOYEE:
            document.body.classList.remove('default');
            document.body.classList.remove('user');
            document.body.classList.add('retail');
            break;
        case UserRole.RECYCLE_COMPANY:
            document.body.classList.remove('retail');
            document.body.classList.remove('user');
            document.body.classList.add('default');
            break;
        default:
            document.body.classList.remove('retail');
            document.body.classList.remove('user');
            document.body.classList.add('default');
            break;
    }
  }
}
