import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/auth/config/jwt.config';
import { EnvValidationSchema } from 'src/common/config/env.validation';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { TestMiddleware } from 'src/common/middlewares/auth.middleware';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [jwtConfig],
      validate(config) {
        // plainToInstance tranforma o objeto config (as variáveis de ambiente) em uma instância de EnvValidationSchema
        const validatedConfig = plainToInstance(EnvValidationSchema, config, {
          enableImplicitConversion: true,
        });
        // enableImplicitConverion: true é usada para permitir que o class-transformer converta automaticamente os tipos ao transformar o objeto

        // verifica se os valores da instância respeitam as regras de validação declaradas na sua classe. Se algum campo estiver errado, retorna uma lista de erros
        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`.env erro de validação: ${errors}`);
        }

        return validatedConfig;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthAdminGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
