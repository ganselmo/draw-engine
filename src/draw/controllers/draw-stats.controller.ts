import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawStatsService } from '../services/draw-stats.service';
import { DrawStatsDto } from '../dtos/draw-stats.dto';
import { DrawPercentsDto } from '../dtos/draw-percents.dto';
import { DrawRemainingDaysDto } from '../dtos/draw-remaining-days.dto';

@UseGuards(JwtAuthGuard)
@Controller('draws/:id/stats')
export class DrawStatsController {
  constructor(private readonly drawStatsService: DrawStatsService) {}
  
  @Get()
  showStats(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.showStats(id);
  }

  @Get('available')
  availableTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.availableTickets(id);
  }

  @Get('reserved')
  reservedTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.reservedTickets(id);
  }

  @Get('confirmed')
  confirmedTickets(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.confirmedTickets(id);
  }

  @Get('percents')
  statsPercentage(@Param('id') id: string): Promise<DrawPercentsDto> {
    return this.drawStatsService.statsPercentage(id);
  }

  @Get('remaining-days')
  remainingDays(@Param('id') id: string): Promise<DrawRemainingDaysDto> {
    return this.drawStatsService.remainingDays(id);
  }
}
