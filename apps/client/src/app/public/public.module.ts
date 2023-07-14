import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import {ForgottenPasswordComponent} from './pages/forgotten-password/forgotten-password.component';
import {VerifyEmailComponent} from './pages/verify-email/verify-email.component';
import {PublicRoutingModule} from './public-routing.module';
import { PublicPageComponent } from './pages/public-page/public-page.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgottenPasswordComponent,
    VerifyEmailComponent,
    PublicPageComponent,
  ],
  imports: [
      MatButtonModule,
      MatInputModule,
    PublicRoutingModule,
    CommonModule
  ]
})
export class PublicModule { }
