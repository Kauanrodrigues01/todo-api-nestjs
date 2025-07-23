import { BaseUserDto } from './base-user.dto';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  PickType(BaseUserDto, ['name', 'email']),
) {}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'senhaAntiga123' })
  @IsString()
  @IsNotEmpty({ message: 'A senha antiga é obrigatória' })
  oldPassword: string;

  @ApiProperty({ example: 'novaSenha456' })
  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
}
