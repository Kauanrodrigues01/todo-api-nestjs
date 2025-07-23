import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Estudar NestJS' })
  name: string;

  @ApiProperty({ example: 'Estudar controller, services e documentação' })
  description: string | null;

  @ApiProperty({ example: TaskStatus.PENDING, enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
}
