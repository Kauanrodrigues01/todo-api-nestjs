import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionSchema {
  @ApiProperty({
    example: ['O campo email é obrigatório.'],
    description: 'Mensagem de erro detalhada ou lista de mensagens',
  })
  message: string[] | string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Nome do erro HTTP',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'Código de status HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data e hora do erro (ISO string)',
  })
  timestamp: string;
}

export class NotFoundExceptionSchema {
  @ApiProperty({
    example: 'Item com ID 123 não encontrado',
    description: 'Mensagem de erro detalhada ou lista de mensagens',
  })
  message: string[] | string;

  @ApiProperty({
    example: 'Not Found',
    description: 'Nome do erro HTTP',
  })
  error: string;

  @ApiProperty({
    example: 404,
    description: 'Código de status HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data e hora do erro (ISO string)',
  })
  timestamp: string;
}

export class InternalServerErrorExceptionSchema {
  @ApiProperty({
    example: 'Erro interno no servidor',
    description: 'Mensagem de erro detalhada ou lista de mensagens',
  })
  message: string[] | string;

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'Nome do erro HTTP',
  })
  error: string;

  @ApiProperty({
    example: 500,
    description: 'Código de status HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data e hora do erro (ISO string)',
  })
  timestamp: string;
}
