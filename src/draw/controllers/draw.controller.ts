import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { DrawService } from '../services/draw.service';
import { DrawResponseDto } from '../dtos/draw-response.dto';
import { UpdateDrawDto } from '../dtos/update-draw.dto';
import { CreateDrawDto } from '../dtos/create-draw.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Draws')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('draws')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new draw' })
  @ApiResponse({
    status: 201,
    description: 'Draw successfully created',
    type: DrawResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  create(
    @Req() req: Request,
    @Body() createDrawDTO: CreateDrawDto,
  ): Promise<DrawResponseDto> {
    const ownerId = req['user'].sub;
    return this.drawService.create(ownerId, createDrawDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all draws' })
  @ApiResponse({
    status: 200,
    description: 'List of all draws',
    type: DrawResponseDto,
    isArray: true,
  })
  @ApiErrorResponses([401, 500])
  findAll(): Promise<DrawResponseDto[]> {
    return this.drawService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get draw by ID' })
  @ApiResponse({
    status: 200,
    description: 'Draw found',
    type: DrawResponseDto,
  })
  @ApiErrorResponses([401, 500])
  findOne(@Param('id') id: string): Promise<DrawResponseDto> {
    return this.drawService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a draw by ID' })
  @ApiResponse({
    status: 200,
    description: 'Draw updated',
    type: DrawResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  update(
    @Param('id') id: string,
    @Body() updateDrawDTO: UpdateDrawDto,
  ): Promise<DrawResponseDto> {
    return this.drawService.update(id, updateDrawDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draw by ID' })
  @ApiResponse({
    status: 200,
    description: 'Draw deleted',
    type: DrawResponseDto,
  })
  @ApiErrorResponses([401, 500])
  remove(@Param('id') id: string): Promise<DrawResponseDto> {
    return this.drawService.remove(id);
  }
}