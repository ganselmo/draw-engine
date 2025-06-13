import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordChangeDto } from './dto/password-change-dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(id: string): Promise<UserResponseDto> {
    throw new Error('Method not implemented.');
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    throw new Error('Method not implemented.');
  }

  async deleteAccount(
    id: string,
    deleteUserDto: DeleteUserDto,
  ): Promise<UserResponseDto> {
    throw new Error('Method not implemented.');
  }

  async changePassword(
    id: string,
    passwordChange: PasswordChangeDto,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async changeEmail(id: string, updateEmailDto: UpdateEmailDto): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async changeUserName(
    id: string,
    updateUserNameDto: UpdateUserNameDto,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
