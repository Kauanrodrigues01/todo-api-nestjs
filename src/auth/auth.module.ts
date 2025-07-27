import { Global, Module } from '@nestjs/common';
import { BcryptService } from './hash/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Módulo global - Pode ser usado na aplicação inteira (não precisa importar em outros módulos para usar)
@Global()
@Module({
  providers: [BcryptService, AuthService],
  exports: [BcryptService],
  controllers: [AuthController], // torna o serviço disponível para outros módulos
})
export class AuthModule {}
