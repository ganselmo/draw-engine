import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    return {access_token: token };

  }

  register(registerDto: RegisterDto) {
    throw new Error('Method not implemented.');
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { email: identifier },
        { username: identifier },
      ],
    });
  }
}
