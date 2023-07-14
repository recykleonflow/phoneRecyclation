import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import {ForgottenPasswordComponent} from './pages/forgotten-password/forgotten-password.component';
import {VerifyEmailComponent} from './pages/verify-email/verify-email.component';
import {PublicPageComponent} from './pages/public-page/public-page.component';

const routes: Routes = [
    {
        path: '', component: PublicPageComponent, children: [
            {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
            {path: 'sign-in', component: SignInComponent},
            {path: 'register-user', component: SignUpComponent},
            {path: 'forgot-password', component: ForgottenPasswordComponent},
            {path: 'verify-email-address', component: VerifyEmailComponent},
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule {
}
