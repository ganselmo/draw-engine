import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DrawRemainingDaysDto {
  @ApiProperty({
    description: 'Number of days remaining until the draw date',
    example: 12,
  })
  @Expose()
  remainingDays: number;
}