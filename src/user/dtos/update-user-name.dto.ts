import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserNameDto {
  @ApiProperty({
    description: 'New username to update the account with',
    example: 'newUsername99',
    minLength: 8,
    maxLength: 16,
  })
  @MinLength(8)
  @MaxLength(16)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Current password to authorize the username change',
    example: 'myCurrentP@ssword',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}