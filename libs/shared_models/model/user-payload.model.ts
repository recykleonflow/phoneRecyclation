import {UserEntity} from '../../../apps/server/src/core/entities/user.entity';

export class UserPayload extends UserEntity {
    name: string;
    picture: string;
    emailVerified: boolean;
}
