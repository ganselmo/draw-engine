import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckUserNameDto } from './dtos/check-user-name.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { ApiErrorResponses } from '../decorators/swagger.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiErrorResponses([401, 500])
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and return JWT' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiErrorResponses([400, 409, 500])
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user and invalidate JWT' })
  @ApiResponse({ status: 201, description: 'User successfully logged out' })
  @ApiErrorResponses([401, 500])
  logout(@Req() req: Request): Promise<string> {
    return this.authService.logout(req);
  }

  @Get('check-email')
  @ApiOperation({ summary: 'Check if an email is already registered' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether email exists',
    schema: { example: { exists: true } },
  })
  @ApiErrorResponses([400, 500])
  checkEmail(
    @Query() { email }: CheckEmailDto,
  ): Promise<{ exists: boolean }> {
    return this.authService.checkEmail(email);
  }

  @Get('check-username')
  @ApiOperation({ summary: 'Check if a username is already taken' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether username exists',
    schema: { example: { exists: false } },
  })
  @ApiErrorResponses([400, 500])
  checkUsername(
    @Query() { username }: CheckUserNameDto,
  ): Promise<{ exists: boolean }> {
    return this.authService.checkUserName(username);
  }
}