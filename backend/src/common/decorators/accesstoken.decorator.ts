import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (req.cookies?.access_token) {
      const access_token = req.cookies?.access_token;
      return access_token;
    } else {
      return '';
    }
  },
);
