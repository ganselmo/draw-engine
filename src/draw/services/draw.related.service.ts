import { Injectable } from '@nestjs/common';
import { Draw } from '../entities/draw.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DrawService } from './draw.service';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Injectable()
export class DrawRelatedService {
  constructor(
    @InjectRepository(Draw)
    private drawService: DrawService,
  ) {}

  async getDrawTickets(id: string): Promise<Ticket[]> {
    const draw = await this.drawService.fetchDrawById(id);
    return draw.tickets;
  }
  async checkIfNumberIsAvailable(id: string, number: number): Promise<boolean> {
    const draw = await this.drawService.fetchDrawById(id);
    return !!draw.tickets.filter((ticket) => ticket.number === number);
  }
}
