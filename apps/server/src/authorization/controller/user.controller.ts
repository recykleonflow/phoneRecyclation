import {Controller, Get, Query} from '@nestjs/common';

import {AuthorizedResource} from '../decorator/authorized.resource';
import {CurrentUser} from '../decorator/current-user.decorator';
import {UserService} from '../service/user.service';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService) {
    }

    @Get('')
    @AuthorizedResource()
    getLoggedInUser(@CurrentUser() user: UserPayload): UserPayload {
        return user;
    }

    @Get('find')
    @AuthorizedResource()
    findUser(@CurrentUser() user: UserPayload, @Query() query: {email: string}): Promise<UserPayload[]> {
        return this.userService.getUsersByEmail(query.email);
    }
}
