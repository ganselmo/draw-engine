import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckUserNameDto {
  @ApiProperty({
    description: 'Username to check for availability',
    example: 'pineapple31',
  })
  @IsString()
  username: string;
}