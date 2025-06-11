import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { checkUserNameDto } from './dto/check-user-name.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('check-email')
  async checkEmail(@Query('email') { email }: CheckEmailDto) {
    return this.authService.checkEmail(email);
  }

  @Get('check-username')
  async checkUsername(@Query('username') { username }: checkUserNameDto) {
    return this.authService.checkUserName(username);
  }

  @Get('logout')
  logout() {
    return this.authService.logout();
  }
}
