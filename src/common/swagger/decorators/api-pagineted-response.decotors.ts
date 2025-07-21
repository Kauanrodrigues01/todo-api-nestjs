import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  PaginatedMetaDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination-response.dto';

export const ApiOkPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, model, PaginatedMetaDto),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          meta: { $ref: getSchemaPath(PaginatedMetaDto) },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};
