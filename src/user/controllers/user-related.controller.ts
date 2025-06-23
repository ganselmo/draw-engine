import { UseGuards, Controller, Get, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserRelatedService } from '../services/user-related.service';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';
import { DrawResponseDto } from '../../draw/dtos/draw-response.dto';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserRelatedController {
  constructor(private readonly userRelatedService: UserRelatedService) {}

  @Get('me/tickets')
  @ApiOperation({ summary: 'Get all tickets belonging to the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user-owned tickets',
    type: TicketResponseDto,
    isArray: true,
  })
  @ApiErrorResponses([401, 500])
  getMyTickets(@Req() req: Request): Promise<TicketResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getMyTickets(id);
  }

  @Get('me/owned-draws')
  @ApiOperation({ summary: 'Get all draws created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of draws owned by the user',
    type: DrawResponseDto,
    isArray: true,
  })
  @ApiErrorResponses([401, 500])
  getOwnedDraws(@Req() req: Request): Promise<DrawResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getOwnedDraws(id);
  }

  @Get('me/participating-draws')
  @ApiOperation({ summary: 'Get draws where the user has at least one ticket' })
  @ApiResponse({
    status: 200,
    description: 'List of draws the user is participating in',
    type: DrawResponseDto,
    isArray: true,
  })
  @ApiErrorResponses([401, 500])
  getParticipatingDraws(@Req() req: Request): Promise<DrawResponseDto[]> {
    const id = req['user'].sub;
    return this.userRelatedService.getParticipatingDraws(id);
  }
}
