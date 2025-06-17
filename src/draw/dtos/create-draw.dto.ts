import { Optional } from '@nestjs/common';
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

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  ticketPrice: number;

  @IsString()
  prize: string;

  @IsDateString()
  @IsOptional()
  drawDate?: string;

  @IsInt()
  @Min(100)
  @Type(() => Number)
  ticketCount: number;
}
