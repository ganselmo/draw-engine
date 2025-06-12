import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.findByEmailOrUsername(loginDto.user);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return { username:user.username,email: user.email, access_token: token };
  }

  async register(registerDto: RegisterDto) {
    if (!registerDto.username && !registerDto.email) {
      throw new BadRequestException(
        'You must provide either a username or an email',
      );
    }
    const userExists = await this.userRepository.exists({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (userExists) throw new ConflictException('User Already exists');

    try {
      const hashedPassword = await argon2.hash(registerDto.password);
      const user = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      const payload = { sub: user.id };
      const token = this.jwtService.sign(payload);
      return { username:user.username,email: user.email, access_token: token };
    } catch (error) {
      throw new InternalServerErrorException('Error creating User');
    }
  }

  async logout() {
    throw new InternalServerErrorException('Method not implemented.');
  }

  async checkEmail(email: string) {
    const exists = await this.userRepository.exists({ where: { email } });
    return { exists };
  }

  async checkUserName(username: string) {
    const exists = await this.userRepository.exists({ where: { username } });
    return { exists };
  }

  private async findByEmailOrUsername(
    identifier: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }
}
