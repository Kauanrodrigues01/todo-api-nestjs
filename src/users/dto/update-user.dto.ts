import { BaseUserDto } from './base-user.dto';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessages } from 'src/common/messages/validation-messages';

export class UpdateUserDto extends PartialType(
  PickType(BaseUserDto, ['name', 'email']),
) {}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'senhaAntiga123' })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  oldPassword: string;

  @ApiProperty({ example: 'novaSenha456' })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @MinLength(6, {
    message: ValidationMessages.MIN_LENGTH('nova senha', 6),
  })
  newPassword: string;
}
