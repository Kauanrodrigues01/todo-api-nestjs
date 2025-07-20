import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelthCheck(): string {
    return new Date().toDateString();
  }
}
