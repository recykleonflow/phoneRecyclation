import { Component } from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {LoadingService} from '../../../loading.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../public-page/public-page.component.scss']
})
export class SignInComponent {

  isLoading = false;

  constructor(
      public authService: AuthService,
      // public loadingService: LoadingService
  ) { }

  async login(email: string, password: string) {
    this.isLoading = true;
    await this.authService.SignIn(email, password)
    this.isLoading = false;
  }
}
