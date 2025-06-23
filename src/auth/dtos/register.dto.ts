import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Email address (required if username is not provided)',
    example: 'pineapple31@gmail.com',
  })
  @ValidateIf((dto) => !dto.username)
  @IsEmail()
  @IsOptional()
  @IsDefined({ message: 'Email is required when username is not provided' })
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'Username (required if email is not provided)',
    example: 'pineapple31',
  })
  @ValidateIf((dto) => !dto.email)
  @MinLength(8)
  @MaxLength(16)
  @IsString()
  @IsOptional()
  @IsDefined({ message: 'Username is required when email is not provided' })
  @IsNotEmpty()
  username?: string;

  @ApiProperty({
    description: 'Password (10 to 20 characters)',
    example: 'StrongP@ssword123',
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Pineapple Doe',
  })
  @MaxLength(255)
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    description: 'Phone number in international format',
    example: '+5491123456789',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Home address',
    example: '123 Pineapple St, Tropical City',
  })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  address?: string;
}