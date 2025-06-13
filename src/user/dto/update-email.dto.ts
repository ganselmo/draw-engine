import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmailDto {

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}
