import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ValidationMessages } from 'src/common/messages/validation-messages';
import jwtConfig from '../config/jwt.config';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenHeader(request);

    if (!token) {
      throw new UnauthorizedException(ValidationMessages.TOKEN_NOT_PROVIDED);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );
      request['user'] = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(ValidationMessages.TOKEN_INVALID);
    }
  }

  extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }

    return authorization.split(' ')[1];
  }
}
