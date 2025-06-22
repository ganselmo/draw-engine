import { Injectable } from '@nestjs/common';

import { DrawService } from './draw.service';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Injectable()
export class DrawRelatedService {
  constructor(
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
