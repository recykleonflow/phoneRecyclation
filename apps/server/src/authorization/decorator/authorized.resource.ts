import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';


export const AuthorizedResource = (groups: string[] = []) =>
    SetMetadata('groups', groups);
