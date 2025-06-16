import { Module } from '@nestjs/common';
import { DrawController } from './controllers/draw.controller';
import { DrawService } from './services/draw.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './entities/draw.entity';
import { DrawRelatedService } from './services/draw.related.service';
import { DrawRelatedController } from './controllers/draw-related.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([Draw])],
  controllers: [DrawController,DrawRelatedController],
  providers: [DrawService,DrawRelatedService],
})
export class DrawModule {}
