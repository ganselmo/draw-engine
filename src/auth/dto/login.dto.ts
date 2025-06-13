import { IsString, MaxLength, maxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  user: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  password: string;
}
