import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface AuthenticatedRequest extends Request {
  user?: {
    token: string;
    role: string;
  };
}

@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user?.role === 'admin') return true;
    return false;
  }
}
