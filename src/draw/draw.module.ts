import { Module } from '@nestjs/common';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './entities/draw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Draw])],
  controllers: [DrawController],
  providers: [DrawService],
})
export class DrawModule {}
