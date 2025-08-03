import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessages } from '../messages/validation-messages';

export class EnvValidationSchema {
  @IsString({ message: ValidationMessages.FIELD_STRING('DATABASE_URL') })
  @IsNotEmpty({ message: ValidationMessages.FIELD_REQUIRED('DATABASE_URL') })
  DATABASE_URL: string;

  @IsString({ message: ValidationMessages.FIELD_STRING('JWT_SECRET') })
  @IsNotEmpty({ message: ValidationMessages.FIELD_REQUIRED('JWT_SECRET') })
  JWT_SECRET: string;

  @IsString({ message: ValidationMessages.FIELD_STRING('JWT_TTL') })
  @IsNotEmpty({ message: ValidationMessages.FIELD_REQUIRED('JWT_TTL') })
  JWT_TTL: string;

  @IsString({ message: ValidationMessages.FIELD_STRING('JWT_TOKEN_ISSUER') })
  @IsNotEmpty({
    message: ValidationMessages.FIELD_REQUIRED('JWT_TOKEN_ISSUER'),
  })
  JWT_TOKEN_ISSUER: string;
}
