import { BaseUserDto } from './base-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationMessages } from 'src/common/messages/validation-messages';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswords implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> | boolean {
    const dto = validationArguments?.object as { password: string };
    return dto.password === value;
  }

  defaultMessage(): string {
    return 'As senhas não correspondem';
  }
}

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({ example: 'senhaSuperSecreta123' })
  @IsString({ message: ValidationMessages.FIELD_STRING('passwordConfirm') })
  @MinLength(6, {
    message: ValidationMessages.MIN_LENGTH('passwordConfirm', 6),
  })
  @Validate(MatchPasswords)
  passwordConfirm: string;
}
