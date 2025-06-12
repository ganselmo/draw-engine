import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DrawService } from './draw.service';
import { Draw } from './entities/draw.entity';
import { UpdateDrawDto } from './dtos/update-draw.dto';
import { CreateDrawDto } from './dtos/create-draw.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('draws')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post()
  create(@Body() createDrawDTO: CreateDrawDto): Promise<Draw> {
    return this.drawService.create(createDrawDTO);
  }

  @Get()
  findAll(): Promise<Draw[]> {
    return this.drawService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Draw> {
    return this.drawService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDrawDTO: UpdateDrawDto,
  ): Promise<Draw> {
    return this.drawService.update(id, updateDrawDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Draw> {
    return this.drawService.remove(id);
  }
}
