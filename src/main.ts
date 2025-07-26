import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AddHeaderInterceptor } from './common/interceptors/add-header.interceptor';
import { HttpExceptionFilter } from './common/filters/http-error.filter';

// Arquivo que inicia o projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API para gerenciamento de tarefas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurando Global Pipe para a lib class-validator funcionar
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO (ex: campos extras enviados na requisição serão ignorados)
      forbidNonWhitelisted: true, // Lança um erro 400 se a requisição tiver campos que não estão definidos no DTO
      transform: true, // Converte automaticamente os dados recebidos (ex: strings em números) e instancia o DTO corretamente
    }),
  );

  // Configurando Interceptors Globais da aplicação
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new AddHeaderInterceptor());

  // Configurando filtro de errors global
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
