import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawStatsService } from '../services/draw-stats.service';
import { DrawStatsDto } from '../dtos/draw-stats.dto';
import { DrawPercentsDto } from '../dtos/draw-percents.dto';
import { DrawRemainingDaysDto } from '../dtos/draw-remaining-days.dto';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Draw Stats')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('draws/:id/stats')
export class DrawStatsController {
  constructor(private readonly drawStatsService: DrawStatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get global stats for a draw' })
  @ApiResponse({ status: 200, type: DrawStatsDto })
  @ApiErrorResponses([401, 500])
  showStats(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.showStats(id);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available ticket stats for a draw' })
  @ApiResponse({ status: 200, type: DrawStatsDto })
  @ApiErrorResponses([401, 500])
  availableTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.availableTickets(id);
  }

  @Get('reserved')
  @ApiOperation({ summary: 'Get reserved ticket stats for a draw' })
  @ApiResponse({ status: 200, type: DrawStatsDto })
  @ApiErrorResponses([401, 500])
  reservedTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.reservedTickets(id);
  }

  @Get('confirmed')
  @ApiOperation({ summary: 'Get confirmed ticket stats for a draw' })
  @ApiResponse({ status: 200, type: DrawStatsDto })
  @ApiErrorResponses([401, 500])
  confirmedTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.confirmedTickets(id);
  }

  @Get('percents')
  @ApiOperation({ summary: 'Get percentage stats for a draw' })
  @ApiResponse({ status: 200, type: DrawPercentsDto })
  @ApiErrorResponses([401, 500])
  statsPercentage(@Param('id') id: string): Promise<DrawPercentsDto> {
    return this.drawStatsService.statsPercentage(id);
  }

  @Get('remaining-days')
  @ApiOperation({ summary: 'Get remaining days until the draw' })
  @ApiResponse({ status: 200, type: DrawRemainingDaysDto })
  @ApiErrorResponses([401, 500])
  remainingDays(@Param('id') id: string): Promise<DrawRemainingDaysDto> {
    return this.drawStatsService.remainingDays(id);
  }
}