import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Draw } from '../../draw/entities/draw.entity';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';
import { DrawResponseDto } from '../../draw/dtos/draw-response.dto';

@Injectable()
export class UserRelatedService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    private readonly userService: UserService,
  ) {}

  async getParticipatingDraws(id: string): Promise<DrawResponseDto[]> {
    const participatingDraws = await this.drawRepository
      .createQueryBuilder('draw')
      .innerJoin('draw.tickets', 'ticket')
      .where('ticket.userId = :userId', { id })
      .distinct(true)
      .getMany();

    return participatingDraws;
  }

  async getOwnedDraws(id: string): Promise<DrawResponseDto[]> {
    const user = await this.userService.fetchUserById(id);
    return user.ownedDraws;
  }

  async getMyTickets(id: string): Promise<TicketResponseDto[]> {
    const user = await this.userService.fetchUserById(id);
    return user.ownedTickets;
  }
}
