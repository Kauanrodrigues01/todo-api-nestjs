import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { ValidationMessages } from 'src/common/messages/validation-messages';

export class BaseTaskDto {
  @IsString({ message: ValidationMessages.FIELD_STRING('nome') })
  @Length(4, 50, {
    message: ValidationMessages.LENGTH('nome', 4, 50),
  })
  @ApiProperty({ example: 'Estudar NestJS' })
  name: string;

  @IsString({ message: ValidationMessages.FIELD_STRING('descrição') })
  @Length(3, 200, {
    message: ValidationMessages.LENGTH('descrição', 3, 200),
  })
  @IsOptional()
  @ApiProperty({
    example: 'Estudar controller, services e documentação',
    required: false,
  })
  description?: string;

  @IsEnum($Enums.TaskStatus, {
    message: ValidationMessages.ENUM_INVALID('status', $Enums.TaskStatus),
  })
  @ApiProperty({
    enum: $Enums.TaskStatus,
    example: $Enums.TaskStatus.PENDING,
    description:
      'Status da tarefa. Pode ser: completed, in_progress, pending ou cancelled.',
  })
  status: $Enums.TaskStatus;
}
