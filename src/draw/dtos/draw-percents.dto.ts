import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PercentBreakdown {
  @ApiProperty({ example: 60, description: 'Percentage of available tickets' })
  @Expose()
  available: number;

  @ApiProperty({ example: 10, description: 'Percentage of cancelled tickets' })
  @Expose()
  cancelled: number;

  @ApiProperty({ example: 20, description: 'Percentage of reserved tickets' })
  @Expose()
  reserved: number;

  @ApiProperty({ example: 10, description: 'Percentage of paid tickets' })
  @Expose()
  paid: number;
}

export class DrawPercentsDto {
  @ApiProperty({ type: PercentBreakdown })
  @Type(() => PercentBreakdown)
  @Expose()
  percents: PercentBreakdown;
}