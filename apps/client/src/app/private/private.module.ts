import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivatePageComponent } from './pages/private-page/private-page.component';
import { HeaderComponent } from './pages/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AddDeviceComponent } from './pages/add-device/add-device.component';
import { HistoryComponent } from './pages/history/history.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RoleSelectionPageComponent } from './pages/role-selection-page/role-selection-page.component';
import { MatCardModule } from '@angular/material/card';
import { RequestsPageComponent } from './pages/requests-page/requests-page.component';
import { MyDevicesPageComponent } from './pages/my-devices-page/my-devices-page.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { QrPrintPage } from './pages/qr-print-page/qr-print-page.component';
import { QRCodeModule } from 'angularx-qrcode';
import { IsLoadingButtonDirective } from '../shared/directive/is-loading-button.directive';
import { InlineLoaderModule } from '../shared/components/inline-loader/inline-loader.module';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatSliderModule } from '@angular/material/slider';
import { PhoneTableComponent } from './pages/requests-page/components/phone-table/phone-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavbarComponent } from './pages/components/navbar/navbar.component';
import { SidebarComponent } from './pages/components/sidebar/sidebar.component';
import { FooterComponent } from './pages/components/footer/footer.component';
import { ExplorerPageComponent } from './pages/explorer-page/explorer-page.component';
import { PhoneRecyclationStateComponent } from './pages/my-devices-page/components/phone-recyclation-state/phone-recyclation-state.component';
import { StateLifecycleComponent } from './pages/my-devices-page/components/state-lifecycle/state-lifecycle.component';
import { MatChipsModule } from '@angular/material/chips';
import { NftCardComponent } from '../shared/components/nft-card/nft-card.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { OngoingRequestsPageComponent } from './pages/ongoing-requests/ongoing-requests-page.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { LocationPageComponent } from './pages/location-page/location-page.component';
import { MyCollectionComponent } from './pages/my-collection/my-collection.component';
import { MatBadgeModule } from '@angular/material/badge';
import { StatusChangeBarComponent } from './components/status-change-bar/status-change-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NftCardMiniatureComponent } from '../shared/components/nft-card/nft-card-miniature/nft-card-miniature.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OngoingRequestsTableComponent } from './components/ongoing-requests-table/ongoing-requests-table.component';
import { RewardsPageComponent } from './pages/rewards-page/rewards-page.component';
import { NftCardMetadataComponent } from '../shared/components/nft-card/nft-card-metadata/nft-card-metadata.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { GraphComponent } from './components/graph/graph.component';
import { PhoneDetailPageComponent } from './pages/phone-detail/phone-detail-page.component';
import { QrDialogComponent } from './components/qr-dialog/qr-dialog.component';
import { PhoneDetailComponent } from './components/phone-detail/phone-detail.component';
import { MaterialStatsComponent } from './components/material-stats/material-stats.component';
import { NgLetDirective } from './directives/ng-let.directive';
import { TranslateModule } from '@ngx-translate/core';
import { IfRoleDirective } from '../shared/directive/if-role.directive';
import { IonicModule } from '@ionic/angular';
import { RewardRedeemConfirmationComponent } from './pages/rewards-page/reward-redeem-confirmation/reward-redeem-confirmation.component';
import { ToolbarLoaderComponent } from './pages/loading-page/toolbar-loader/toolbar-loader.component';
import {StateIconComponent} from './pipe/state-icon/state-icon.component';
import {UnauthorizedPageComponent} from './pages/unauthorized/unauthorized-page.component';

export const TooltipOptions: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchGestures: 'auto',
  position: 'before',
  touchendHideDelay: 0,
  disableTooltipInteractivity: true,
};

@NgModule({
    declarations: [
        UnauthorizedPageComponent,
        IfRoleDirective,
        DashboardComponent,
        PrivatePageComponent,
        HeaderComponent,
        AddDeviceComponent,
        HistoryComponent,
        RoleSelectionPageComponent,
        RequestsPageComponent,
        MyDevicesPageComponent,
        QrPrintPage,
        IsLoadingButtonDirective,
        PhoneTableComponent,
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        ExplorerPageComponent,
        PhoneRecyclationStateComponent,
        StateLifecycleComponent,
        NftCardComponent,
        NftCardMiniatureComponent,
        NftCardMetadataComponent,
        OngoingRequestsPageComponent,
        LoadingPageComponent,
        LocationPageComponent,
        MyCollectionComponent,
        StatusChangeBarComponent,
        OngoingRequestsTableComponent,
        RewardsPageComponent,
        GraphComponent,
        PhoneDetailPageComponent,
        LoadingPageComponent,
        LoadingPageComponent,
        QrDialogComponent,
        PhoneDetailComponent,
        MaterialStatsComponent,
        RewardRedeemConfirmationComponent,
        ToolbarLoaderComponent,
        StateIconComponent,
        StateIconComponent,
    ],
  imports: [
    TranslateModule.forChild(),
    MatSnackBarModule,
    InlineLoaderModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    PrivateRoutingModule,
    CommonModule,
    MatInputModule,
    MatCardModule,
    QRCodeModule,
    LoadingComponent,
    ZXingScannerModule,
    MatSliderModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    MatBadgeModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatExpansionModule,
    NgChartsModule,
    MatTooltipModule,
    NgLetDirective,
    IonicModule,
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: TooltipOptions },
  ],
})
export class PrivateModule {}
