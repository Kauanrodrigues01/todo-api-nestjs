import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // const token = req.headers.authorization;

    // if (token) {
    //   req['user'] = {
    //     token: token,
    //     role: 'admin',
    //   };
    // }

    // req['user'] = {
    //   role: 'admin',
    // };

    next();
  }
}
