import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from '@nestjs/core';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const neededGroups = this.reflector.get<string[]>('groups', context.getHandler());

    if (neededGroups) {
      return this.hasUserGroups(request['user'])
    }

    return true;
  }

  constructor(private readonly reflector: Reflector) {}

  hasUserGroups(user: any): boolean {
    if (user) {
      return true;
    }
    return false;
  }
}
