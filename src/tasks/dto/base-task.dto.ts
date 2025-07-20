import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseTaskDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(4, 50, {
    message: 'O nome deve ter entre 4 e 50 caracteres.',
  })
  @ApiProperty({ example: 'Estudar NestJS' })
  name: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @Length(3, 200, {
    message: 'A descrição deve ter entre 3 e 200 caracteres.',
  })
  @IsOptional()
  @ApiProperty({
    example: 'Estudar controller, services e documentação',
    required: false,
  })
  description?: string;

  @IsEnum(TaskStatus, {
    message:
      'O status deve ser um dos seguintes valores: completed, pending, in_progress ou cancelled.',
  })
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description:
      'Status da tarefa. Pode ser: completed, in_progress, pending ou cancelled.',
  })
  status: TaskStatus;
}
