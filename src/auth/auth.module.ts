import { Global, Module } from '@nestjs/common';
import { BcryptService } from './hash/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global() // Torna este módulo acessível globalmente (não precisa importar em outros módulos)
@Module({
  imports: [
    PrismaModule,
    // Registra a configuração 'jwt' para que ela possa ser injetada via @Inject(jwtConfig.KEY)
    ConfigModule.forFeature(jwtConfig),
    // Registra o JwtModule assincronamente usando os valores definidos em jwtConfig
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfiguration =
          configService.get<ConfigType<typeof jwtConfig>>('jwt');
        if (!jwtConfiguration) {
          throw new Error('Configuração JWT não encontrada');
        }
        return {
          secret: jwtConfiguration.secret,
          signOptions: {
            expiresIn: jwtConfiguration.jwtTtl,
            issuer: jwtConfiguration.issuer,
            audience: jwtConfiguration.audience,
          },
        };
      },
    }),
  ],
  providers: [BcryptService, AuthService],
  exports: [
    BcryptService, // Disponibiliza o serviço para outros módulos
    JwtModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
