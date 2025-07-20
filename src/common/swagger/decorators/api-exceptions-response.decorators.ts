import {
  BadRequestExceptionSchema,
  InternalServerErrorExceptionSchema,
  NotFoundExceptionSchema,
} from '../schemas/http-exceptions.schemas';
import { ApiResponse } from '@nestjs/swagger';

export const ApiNotFoundResponse = (description = 'Não encontrado') =>
  ApiResponse({
    status: 404,
    description: description,
    type: NotFoundExceptionSchema,
  });

export const ApiBadRequestResponse = (
  description = 'Dados inválidos',
): MethodDecorator =>
  ApiResponse({
    status: 400,
    description: description,
    type: BadRequestExceptionSchema,
  });

export const ApiInternalServerErrorResponse = (
  description = 'Erro interno do servidor',
): MethodDecorator =>
  ApiResponse({
    status: 500,
    description: description,
    type: InternalServerErrorExceptionSchema,
  });
