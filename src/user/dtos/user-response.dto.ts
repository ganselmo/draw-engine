import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiPropertyOptional({
    description: 'Unique username of the user',
    example: 'pineapple31',
  })
  @Expose()
  username?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'pineapple31@gmail.com',
  })
  @Expose()
  email?: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Pineapple McUser',
  })
  @Expose()
  fullName: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+11122334455',
  })
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Address of the user',
    example: '1234 Main St, Springfield',
  })
  @Expose()
  address?: string;
}