import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {

  @ValidateIf((dto) => !dto.username)
  @IsEmail()
  @IsOptional()
  @IsDefined({ message: 'Email is required when username is not provided' })
  @IsNotEmpty()
  email?: string;

  @ValidateIf((dto) => !dto.email)
  @MinLength(8)
  @MaxLength(16)
  @IsString()
  @IsOptional()
  @IsDefined({ message: 'Username is required when email is not provided' })
  @IsNotEmpty()
  username?: string;

  @MinLength(10)
  @MaxLength(20)
  @IsString()
  password: string;

  @MaxLength(255)
  @IsString()
  fullName: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  address?: string;
}
