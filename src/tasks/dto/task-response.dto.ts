import { ApiProperty } from '@nestjs/swagger';
import { BaseTaskDto } from './base-task.dto';

export class TaskResponseDto extends BaseTaskDto {
  @ApiProperty({ example: 1 })
  id: number;
}
