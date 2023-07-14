import {UserRole} from '../../../../../../../../libs/shared_models/enum/user-role';

export class DrawerItem {
    path!: string;
    icon!: string;
    title!: string;
    roles!: UserRole[];
    class!: string;
    badgeCount?: () => number;
}
