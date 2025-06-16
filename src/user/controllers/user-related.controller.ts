import { UseGuards, Controller, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserRelatedService } from '../services/user-related.service';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';
import { DrawResponseDto } from '../../draw/dtos/draw-response.dto';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserRelatedController {
  constructor(private readonly userRelatedService: UserRelatedService) {}

  @Get('me/tickets')
  getMyTickets(@Req() req: Request): Promise<TicketResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getMyTickets(id);
  }

  @Get('me/owned-draws')
  getOwnedDraws(@Req() req: Request): Promise<DrawResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getOwnedDraws(id);
  }

  @Get('me/participating-draws')
  getParticipatingDraws(@Req() req: Request): Promise<DrawResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getParticipatingDraws(id);
  }
}
