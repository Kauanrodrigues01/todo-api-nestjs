import { PartialType } from '@nestjs/swagger'; // o PatialType do swagger mantem as configurações do class-validator e do swagger, o PartialType do mapped-types apenas mantém as configurações do class-validator
import { BaseTaskDto } from './base-task.dto';

export class UpdateTaskDto extends PartialType(BaseTaskDto) {}
