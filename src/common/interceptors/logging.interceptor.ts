import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Interceptando a requisição');

    const now = Date.now();
    const req: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const method = req.method;
        const url = req.url;
        const duration = Date.now() - now;
        console.log(`${method} ${url} - ${duration}ms`);
      }),
      catchError((err) => {
        console.error(`Erro capturado pelo interceptor: ${err}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => err);
      }),
    );
  }
}

/*
next.handle() - Executa o restante da cadeia (controller, service, etc.) e retorna um Observable com o resultado a execução

next.pipe() - É uma função do RxJS usado para manipular ou transformar o valor que será emitido por aquele Observable que vem do next.handle()

Com o pipe() você pode:
  - aplicar map() para transformar a respota
  - aplicar tap() para executar efeitos colaterais (como logs)
  - aplicar catchError() para tratar erros.
*/
