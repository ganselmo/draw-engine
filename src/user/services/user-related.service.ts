import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Draw } from '../../draw/entities/draw.entity';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';
import { DrawResponseDto } from '../../draw/dtos/draw-response.dto';
import { plainToInstance } from 'class-transformer';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRelatedService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async getMyTickets(id: string): Promise<TicketResponseDto[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ownedTickets'],
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user.ownedTickets.map((ownedTicket) =>
      plainToInstance(TicketResponseDto, ownedTicket, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getOwnedDraws(id: string): Promise<DrawResponseDto[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ownedDraws'],
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user.ownedDraws.map((ownedDraw) => {
      return plainToInstance(DrawResponseDto, ownedDraw, {
        excludeExtraneousValues: true,
      });
    });
  }

  async getParticipatingDraws(userId: string): Promise<DrawResponseDto[]> {

    const participatingDraws = await this.drawRepository
      .createQueryBuilder('draw')
      .innerJoin('draw.tickets', 'ticket')
      .where('ticket.userId = :userId', { userId })
      .distinct(true)
      .getMany();
    
    return participatingDraws.map((participatingDraw) => {
      return plainToInstance(DrawResponseDto, participatingDraw, {
        excludeExtraneousValues: true,
      });
    });
  }
}
