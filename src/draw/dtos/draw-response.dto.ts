import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Status } from '../enums/status.enum';
import { UserResponseDto } from '../../user/dtos/user-response.dto';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';

export class DrawResponseDto {
  @ApiProperty({ description: 'Unique identifier of the draw', example: 'a1b2c3d4' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Title of the draw', example: 'Smartphone Raffle' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Detailed description of the draw', example: 'Includes nationwide shipping' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Price of a single ticket', example: 5.0 })
  @Expose()
  ticketPrice: number;

  @ApiProperty({ description: 'Prize to be awarded', example: 'iPhone 15 Pro Max' })
  @Expose()
  prize: string;

  @ApiProperty({
    description: 'Scheduled draw date in ISO format',
    example: '2025-07-15T18:00:00.000Z',
    type: String,
  })
  @Expose()
  drawDate: Date;

  @ApiProperty({ description: 'Total number of tickets for the draw', example: 500 })
  @Expose()
  ticketCount: number;

  @ApiProperty({
    description: 'Current status of the draw',
    enum: Status,
    example: Status.DRAWN,
  })
  @Expose()
  status: Status;

  @ApiProperty({
    description: 'User who created the draw',
    type: UserResponseDto,
  })
  @Type(() => UserResponseDto)
  @Expose()
  owner: UserResponseDto;

  @ApiProperty({
    description: 'List of tickets associated with the draw',
    type: [TicketResponseDto],
  })
  @Type(() => TicketResponseDto)
  @Expose()
  tickets: TicketResponseDto[];
}