import { Module } from '@nestjs/common';
import { DrawController } from './controllers/draw.controller';
import { DrawService } from './services/draw.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './entities/draw.entity';
import { DrawRelatedService } from './services/draw.related.service';
import { DrawRelatedController } from './controllers/draw-related.controller';
import { DrawStatsService } from './services/draw-stats.service';
import { DrawStatsController } from './controllers/draw-stats.controller';
import { Ticket } from '../ticket/entities/ticket.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Draw]),TypeOrmModule.forFeature([Ticket])],
  controllers: [DrawController,DrawRelatedController,DrawStatsController],
  providers: [DrawService,DrawRelatedService,DrawStatsService],
})
export class DrawModule {}
