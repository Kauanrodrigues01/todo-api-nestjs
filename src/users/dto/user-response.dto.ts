import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from 'src/tasks/dto/task-response.dto';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao.silva@exemplo.com' })
  email: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({
    type: [TaskResponseDto],
    example: [
      {
        id: 1,
        name: 'Estudar NestJS',
        description: 'Ler a documentação oficial e praticar com projetos',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Criar API de tarefas',
        description: 'Desenvolver endpoints REST usando NestJS e Prisma',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  })
  tasks: TaskResponseDto[];
}
