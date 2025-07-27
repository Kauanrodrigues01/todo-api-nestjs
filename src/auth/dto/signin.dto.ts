import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessages } from 'src/common/messages/validation-messages';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: ValidationMessages.EMAIL_INVALID })
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Senha do usuário',
  })
  @IsString({ message: ValidationMessages.PASSWORD_REQUIRED })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_STRING })
  password: string;
}
