import { JwtPayload } from './jwt-payload.interface';

export type UserPayload = Pick<JwtPayload, 'sub' | 'email' | 'role'>;
