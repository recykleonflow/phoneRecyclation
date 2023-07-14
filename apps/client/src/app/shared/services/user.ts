import {UserRole} from '../../../../../../libs/shared_models/enum/user-role';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    role: UserRole;
}
