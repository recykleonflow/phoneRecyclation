import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../private/pages/dashboard/dashboard.component';
import {PrivatePageComponent} from './pages/private-page/private-page.component';
import {AddDeviceComponent} from './pages/add-device/add-device.component';
import {HistoryComponent} from './pages/history/history.component';
import {RoleSelectionPageComponent} from './pages/role-selection-page/role-selection-page.component';
import {MyDevicesPageComponent} from './pages/my-devices-page/my-devices-page.component';
import {RequestsPageComponent} from './pages/requests-page/requests-page.component';
import {QrPrintPage} from './pages/qr-print-page/qr-print-page.component';
import {ExplorerPageComponent} from './pages/explorer-page/explorer-page.component';
import {OngoingRequestsPageComponent} from './pages/ongoing-requests/ongoing-requests-page.component';
import {MyCollectionComponent} from './pages/my-collection/my-collection.component';
import {LocationPageComponent} from './pages/location-page/location-page.component';
import {RewardsPageComponent} from './pages/rewards-page/rewards-page.component';
import {PhoneDetailPageComponent} from './pages/phone-detail/phone-detail-page.component';
import {PhoneResolver} from './pages/phone-detail/resolver/phone.resolver';
import {UserRole} from '../../../../../libs/shared_models/enum/user-role';
import {IsRoleAuthorizedGuard} from '../shared/guards/is-role-authorized.guard';
import {UnauthorizedPageComponent} from './pages/unauthorized/unauthorized-page.component';

const routes: Routes = [
    {
        path: '',
        component: PrivatePageComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'unauthorized',
                component: UnauthorizedPageComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: {
                    roles: [UserRole.EMPLOYEE],
                    title: 'Dashboard',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'add-device',
                component: AddDeviceComponent,
                data: {
                    roles: [UserRole.EMPLOYEE],
                    title: 'Add device',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'add-device-success',
                component: QrPrintPage,
                data: {
                    roles: [UserRole.EMPLOYEE],
                    title: 'Success adding device',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'history',
                component: HistoryComponent,
                data: {
                    roles: [UserRole.EMPLOYEE],
                    title: 'History',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'ongoing-requests',
                component: OngoingRequestsPageComponent,
                data: {
                    roles: [UserRole.EMPLOYEE],
                    title: 'Ongoing requests',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'explorer',
                component: ExplorerPageComponent,
                data: {
                    roles: [UserRole.RECYCLE_COMPANY, UserRole.EMPLOYEE],
                    title: 'Blockchain explorer',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'my-devices',
                component: MyDevicesPageComponent,
                data: {
                    roles: [UserRole.CLIENT],
                    title: 'My devices',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'collection',
                component: MyCollectionComponent,
                data: {
                    roles: [UserRole.CLIENT],
                    title: 'Collection',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'location',
                component: LocationPageComponent,
                data: {
                    roles: [UserRole.CLIENT],
                    title: 'How to recycle',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'requests',
                component: RequestsPageComponent,
                data: {
                    roles: [UserRole.RECYCLE_COMPANY],
                    title: 'Requests',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'rewards',
                component: RewardsPageComponent,
                data: {
                    roles: [UserRole.CLIENT],
                    title: 'Rewards',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
            {
                path: 'phone/:ual', component: PhoneDetailPageComponent, resolve: {phones: PhoneResolver}, data: {
                    roles: [UserRole.RECYCLE_COMPANY, UserRole.EMPLOYEE],
                    title: 'Phone detail',
                },
                canActivate: [IsRoleAuthorizedGuard]
            },
        ]

    },
    {
        path: 'select-role',
        component: RoleSelectionPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateRoutingModule {
}
