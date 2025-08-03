import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function expectValidDto<T extends object>(
  dtoClass: new () => T,
  plainObj: any,
) {
  const dto = plainToInstance(dtoClass, plainObj);
  const errors = validateSync(dto, { forbidUnknownValues: false });
  expect(errors.length).toBe(0);
}
