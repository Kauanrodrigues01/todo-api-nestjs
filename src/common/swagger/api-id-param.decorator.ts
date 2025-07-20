import { ApiParam } from '@nestjs/swagger';

export const ApiIdParam = () =>
  ApiParam({
    name: 'id',
    description: 'ID único da tarefa',
    type: 'number',
    example: 1,
  });
