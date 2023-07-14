import {Injectable} from '@angular/core';
import {UserRole} from '../../../../../../../libs/shared_models/enum/user-role';
import {DrawerItem} from './model/drawer-item.model';
import {RequestQueueService} from '../phone/request-queue.service';
import {LoadingState} from '../phone/model/loading-state.enum';

@Injectable({
  providedIn: 'root'
})
export class DrawerItemsService {

  constructor(private phoneQueueService: RequestQueueService) { }

    getAllRoutes(): DrawerItem[] {
      return [
          { path: '/private/dashboard', title: 'Dashboard',  icon: 'monitoring', class: '', roles: [UserRole.EMPLOYEE] },
          { path: '/private/add-device', title: 'Add device',  icon: 'library_add', class: '', roles: [UserRole.EMPLOYEE] },
          { path: '/private/ongoing-requests', title: 'Ongoing requests', icon: 'history', class: '', roles: [UserRole.EMPLOYEE],
              badgeCount: () =>
                  this.phoneQueueService.requestQueue.filter(phoneQueue =>
                      [
                          LoadingState.LOADING,
                          LoadingState.READING_FROM_BLOCKCHAIN,
                          LoadingState.WRITING_INTO_BLOCKCHAIN
                      ].includes(phoneQueue.state)).length},
          { path: '/private/my-devices', title: 'My Devices',  icon: 'phone_iphone', class: '', roles: [UserRole.CLIENT] },
          { path: '/private/collection', title: 'Card Collection',  icon: 'apps', class: '', roles: [UserRole.CLIENT] },
          { path: '/private/rewards', title: 'Rewards',  icon: 'redeem', class: '', roles: [UserRole.CLIENT] },
          { path: '/private/location', title: 'How to Recykle',  icon: 'recycling', class: '', roles: [UserRole.CLIENT] },
          { path: '/private/requests', title: 'Requests',  icon: 'dvr', class: '', roles: [UserRole.RECYCLE_COMPANY], badgeCount: () =>
                  this.phoneQueueService.requestQueue.filter(phoneQueue => phoneQueue.state === LoadingState.COMPLETE).length },
          { path: '/private/explorer', title: 'Blockchain explorer',  icon:'travel_explore', class: '', roles: [UserRole.EMPLOYEE, UserRole.RECYCLE_COMPANY] }
      ]
    }
}
