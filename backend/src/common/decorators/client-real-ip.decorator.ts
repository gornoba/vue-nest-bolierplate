import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as requestIp from 'request-ip';

export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (request.header['cf-connecting-ip']) {
      return request.header['cf-connecting-ip'];
    } else {
      return requestIp.getClientIp(request);
    }
  },
);
