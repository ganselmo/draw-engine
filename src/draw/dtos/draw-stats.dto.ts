import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DrawStatsDto {
  @ApiProperty({
    description: 'Quantity summary of ticket statuses',
    example: {
      available: 320,
      cancelled: 15,
      reserved: 100,
      paid: 65,
    },
  })
  @Expose()
  count: {
    available: number;
    cancelled: number;
    reserved: number;
    paid: number;
  };

  @ApiProperty({
    description: 'List of available ticket numbers',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @Expose()
  available: number[];

  @ApiProperty({
    description: 'List of reserved ticket numbers',
    example: [6, 7, 8],
    type: [Number],
  })
  @Expose()
  reserved: number[];

  @ApiProperty({
    description: 'List of paid ticket numbers',
    example: [9, 10, 11],
    type: [Number],
  })
  @Expose()
  paid: number[];
}