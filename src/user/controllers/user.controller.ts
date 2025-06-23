import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserResponseDto } from '../dtos/user-response.dto';
import { PasswordChangeDto } from '../dtos/password-change-dto';
import { UpdateEmailDto } from '../dtos/update-email.dto';
import { UpdateUserNameDto } from '../dtos/update-user-name.dto';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { TokenUtilsService } from '../../shared/utils/token-utils.service';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenUtilsService: TokenUtilsService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile data',
    type: UserResponseDto,
  })
  @ApiErrorResponses([401, 500])
  getProfile(@Req() req: Request): Promise<UserResponseDto> {
    const id = req['user'].sub;
    return this.userService.getProfile(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated user profile',
    type: UserResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const id = req['user'].sub;
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted',
    type: UserResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  deleteAccount(
    @Req() req: Request,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<UserResponseDto> {
    const id = req['user'].sub;
    const token = this.tokenUtilsService.getTokenFromRequest(req);
    return this.userService.deleteAccount(id, token, deleteUserDto);
  }

  @Patch('me/change-password')
  @ApiOperation({ summary: 'Change account password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: { type: 'string', example: 'Password updated' },
  })
  @ApiErrorResponses([400, 401, 500])
  changePassword(
    @Req() req: Request,
    @Body() passwordChange: PasswordChangeDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changePassword(id, passwordChange);
  }

  @Patch('me/change-email')
  @ApiOperation({ summary: 'Change account email' })
  @ApiResponse({
    status: 200,
    description: 'Email changed successfully',
    schema: { type: 'string', example: 'Email updated' },
  })
  @ApiErrorResponses([400, 401, 500])
  changeEmail(
    @Req() req: Request,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changeEmail(id, updateEmailDto);
  }

  @Patch('me/change-username')
  @ApiOperation({ summary: 'Change account username' })
  @ApiResponse({
    status: 200,
    description: 'Username changed successfully',
    schema: { type: 'string', example: 'Username updated' },
  })
  @ApiErrorResponses([400, 401, 500])
  changeUserName(
    @Req() req: Request,
    @Body() updateUserNameDto: UpdateUserNameDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changeUserName(id, updateUserNameDto);
  }
}
