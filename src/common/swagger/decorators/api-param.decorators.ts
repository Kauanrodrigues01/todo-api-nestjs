import { ApiParam } from '@nestjs/swagger';

export const ApiIdParam = (): MethodDecorator =>
  ApiParam({
    name: 'id',
    description: 'ID único da tarefa',
    type: 'number',
    example: 1,
  });
