import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthService} from './shared/services/auth.service';
import {LoggedInGuard} from './shared/guards/logged-in-guard.service';
import {NotLogedInGuard} from './shared/guards/not-loged-in.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'private'
  },
    {
  canActivate: [NotLogedInGuard],
  path: 'public',
  loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
},{
  canActivate: [LoggedInGuard],
  path: 'private',
  loadChildren: () => import('./private/private.module').then(m => m.PrivateModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private loginGuard: LoggedInGuard) {}
}
