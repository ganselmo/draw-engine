import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const maxLength = 5;

export abstract class BaseTicketDto {
  @ApiProperty({
    description: 'ID of the draw where tickets are being selected',
    example: 'a1b2c3d4',
  })
  @IsString()
  drawId: string;

  @ApiProperty({
    description: `Array of unique ticket numbers (min: 1, max: ${maxLength})`,
    example: [7, 12, 23],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one ticket number must be selected' })
  @ArrayUnique({ message: 'Duplicate ticket numbers are not allowed' })
  @IsInt({ each: true, message: 'Each ticket number must be an integer' })
  @Min(0, { each: true, message: 'Minimum number is 1' })
  @ArrayMaxSize(maxLength, { message: `Maximum length is ${maxLength}` })
  numbers: number[];
}
