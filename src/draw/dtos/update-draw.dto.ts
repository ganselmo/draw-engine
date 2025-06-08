import { CreateDrawDto } from './create-draw.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDrawDto extends PartialType(CreateDrawDto) {}

