import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'generated/prisma';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Estudar NestJS' })
  name: string;

  @ApiProperty({ example: 'Estudar controller, services e documentação' })
  description: string;

  @ApiProperty({ example: TaskStatus.PENDING, enum: TaskStatus })
  status: TaskStatus;
}
