import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext): any => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
