import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Unique username assigned to the user',
    example: 'pineapple31',
  })
  username: string;

  @ApiProperty({
    description: 'Registered email address of the user',
    example: 'pineapple31@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'JWT access token used for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}