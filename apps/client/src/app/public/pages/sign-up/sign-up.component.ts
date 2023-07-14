import { Component } from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../public-page/public-page.component.scss']
})
export class SignUpComponent {
  constructor(
      public authService: AuthService
  ) { }
}
