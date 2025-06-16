import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { PasswordChangeDto } from '../dto/password-change-dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdateUserNameDto } from '../dto/update-user-name.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { TokenUtilsService } from '../../shared/utils/token-utils.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenUtilsService: TokenUtilsService,
  ) {}

  @Get("me")
  getProfile(@Req() req: Request): Promise<UserResponseDto> {
    const id = req['user'].sub;
    return this.userService.getProfile(id);
  }

  @Patch("me")
  updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const id = req['user'].sub;
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Delete("me")
  deleteAccount(
    @Req() req: Request,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<UserResponseDto> {
    const id = req['user'].sub;
    const token = this.tokenUtilsService.getTokenFromRequest(req);
    return this.userService.deleteAccount(id,token, deleteUserDto);
  }
  @Patch('me/change-password')
  changePassword(
    @Req() req: Request,
    @Body() passwordChange: PasswordChangeDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changePassword(id, passwordChange);
  }

  @Patch('me/change-email')
  changeEmail(
    @Req() req: Request,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changeEmail(id, updateEmailDto);
  }

  @Patch('me/change-username')
  changeUserName(
    @Req() req: Request,
    @Body() updateUserNameDto: UpdateUserNameDto,
  ): Promise<string> {
    const id = req['user'].sub;
    return this.userService.changeUserName(id, updateUserNameDto);
  }
}
