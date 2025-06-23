import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    description: 'Current user password for account deletion confirmation',
    example: 'mySecureP@ss123',
    minLength: 10,
    maxLength: 20,
  })
  @MinLength(10)
  @MaxLength(20)
  @IsString()
  currentPassword: string;
}