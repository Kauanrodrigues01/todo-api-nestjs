import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'Número da página' })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(50, { message: 'Número máximo de itens por página é 50' })
  @Type(() => Number)
  @ApiProperty({ example: 10, description: 'Itens por página', maximum: 50 })
  limit?: number = 10;
}
