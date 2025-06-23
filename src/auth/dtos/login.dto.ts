import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email used to log in',
    example: 'pineapple31',
  })
  @IsString()
  user: string;

  @ApiProperty({
    description: 'User password (10 to 20 characters)',
    example: 'mySecureP@ss123',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  password: string;
}