import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

const maxLength: number = 5;

export abstract class BaseTicketDto {
  @IsString()
  drawId: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one ticket number must be selected' })
  @ArrayUnique({ message: 'Duplicate ticket numbers are not allowed' })
  @IsInt({ each: true, message: 'Each ticket number must be an integer' })
  @Min(0, { each: true, message: 'Minimum number is 1' })
  @ArrayMaxSize(maxLength, { message: `Maximum length is ${maxLength}` })
  numbers: number[];
}
