import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data as object,
        timestamp: new Date().toISOString(),
      })),
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
