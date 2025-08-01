import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { UserPayload } from '../types/user-payload.type';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const context = ctx.switchToHttp();
    const request: RequestWithUser = context.getRequest();

    return request.user;
  },
);
