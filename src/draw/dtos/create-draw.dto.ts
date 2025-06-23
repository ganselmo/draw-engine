import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateDrawDto {
  @ApiProperty({
    description: 'Title of the draw',
    example: 'Smartphone Raffle',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the draw',
    example: 'This draw includes free shipping nationwide',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price per ticket in USD or local currency',
    example: 5.0,
  })
  @IsNumber()
  @Type(() => Number)
  ticketPrice: number;

  @ApiProperty({
    description: 'Name or description of the prize',
    example: 'iPhone 15 Pro Max 256GB',
  })
  @IsString()
  prize: string;

  @ApiPropertyOptional({
    description: 'Scheduled date for the draw (ISO format)',
    example: '2025-07-15T18:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  drawDate?: string;

  @ApiProperty({
    description: 'Total number of tickets to be issued (minimum 100)',
    example: 500,
  })
  @IsInt()
  @Min(100)
  @Type(() => Number)
  ticketCount: number;
}