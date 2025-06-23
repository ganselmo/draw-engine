import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @ApiProperty({
    description: 'Current user password',
    example: 'oldPassword123',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password to be set',
    example: 'newSecureP@ss456',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'newSecureP@ss456',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  confirmPassword: string;
}