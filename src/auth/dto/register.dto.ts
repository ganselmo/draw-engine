import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
