import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessages } from '../messages/validation-messages';

export class EnvValidationSchema {
  @IsString({ message: ValidationMessages.FIELD_STRING('DATABASE_URL') })
  @IsNotEmpty({ message: ValidationMessages.FIELD_REQUIRED('DATABASE_URL') })
  DATABASE_URL: string;
}
