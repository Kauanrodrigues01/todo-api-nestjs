import { Request } from 'express';
import { UserPayload } from 'src/auth/types/user-payload.type';

export interface RequestWithUser extends Request {
  user: UserPayload;
}
