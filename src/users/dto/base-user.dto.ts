import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ValidationMessages } from 'src/common/messages/validation-messages';

export class BaseUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString({ message: ValidationMessages.FIELD_STRING('name') })
  @IsNotEmpty({ message: ValidationMessages.FIELD_REQUIRED('name') })
  name: string;

  @ApiProperty({ example: 'joao.silva@exemplo.com' })
  @IsEmail({}, { message: ValidationMessages.EMAIL_INVALID })
  email: string;

  @ApiProperty({ example: 'senhaSuperSecreta123' })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @MinLength(6, { message: ValidationMessages.MIN_LENGTH('password', 6) })
  password: string;
}
