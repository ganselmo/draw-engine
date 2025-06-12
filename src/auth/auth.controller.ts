import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { checkUserNameDto } from './dto/check-user-name.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request):Promise<string> {
    return this.authService.logout(req);
  }

  @Get('check-email')
  checkEmail(@Query('email') { email }: CheckEmailDto): Promise<{ exists: boolean }> {
    return this.authService.checkEmail(email);
  }

  @Get('check-username')
  checkUsername(@Query('username') { username }: checkUserNameDto): Promise<{ exists: boolean }> {
    return this.authService.checkUserName(username);
  }
}
