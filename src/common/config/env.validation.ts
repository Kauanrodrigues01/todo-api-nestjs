import { IsNotEmpty, IsString } from 'class-validator';

export class EnvValidationSchema {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}
