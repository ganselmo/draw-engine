import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({
    description: 'New email address to update the account with',
    example: 'new.email@example.com',
  })
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Current password to authorize the email update',
    example: 'currentPass123',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}