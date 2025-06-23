import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty({
    description: 'Email address to check for existing user',
    example: 'pineapple31@gmail.com',
  })
  @IsEmail({}, { message: 'The email must be a valid email address' })
  email: string;
}
