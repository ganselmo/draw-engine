import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    description: 'User phone number in international format',
    example: '+541122334455',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '1234 Elm Street, Springfield',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  address?: string;
}
