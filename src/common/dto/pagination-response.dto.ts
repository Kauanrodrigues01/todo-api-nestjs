// common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  itemCount: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: () => PaginatedMetaDto })
  meta: PaginatedMetaDto;

  @ApiProperty({ isArray: true })
  data: T[];
}
