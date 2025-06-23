import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PasswordChangeDto } from '../dtos/password-change-dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UpdateUserNameDto } from '../dtos/update-user-name.dto';
import { UpdateEmailDto } from '../dtos/update-email.dto';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as argon2 from 'argon2';
import { TokenBlacklistService } from '../../shared/services/token-blacklist.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenBlackListService: TokenBlacklistService,
  ) {}

  async getProfile(id: string): Promise<UserResponseDto> {
    const user = await this.fetchUserById(id);
    return this.toUserResponseDto(user);
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.fetchUserById(id);
    try {
      this.userRepository.merge(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);
      return this.toUserResponseDto(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating User ${error}`);
    }
  }

  async deleteAccount(
    id: string,
    token: string | null,
    deleteUserDto: DeleteUserDto,
  ): Promise<UserResponseDto> {
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = await this.fetchUserById(id);

    const passwordMatches = await this.verifyPassword(
      user,
      deleteUserDto.currentPassword,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    try {
      await this.userRepository.delete(id);
      await this.tokenBlackListService.blacklistToken(token);
      return this.toUserResponseDto(user);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting User ${error}`);
    }
  }

  async changePassword(
    id: string,
    passwordChangeDto: PasswordChangeDto,
  ): Promise<string> {
    const user = await this.fetchUserById(id);

    const newPasswordHash = await argon2.hash(passwordChangeDto.newPassword);
    return this.secureUpdate(
      user,
      passwordChangeDto.currentPassword,
      { password: newPasswordHash },
      'Password Changed',
      'Error changing password',
    );
  }

  async changeEmail(
    id: string,
    updateEmailDto: UpdateEmailDto,
  ): Promise<string> {
    const existing = await this.userRepository.findOneBy({
      email: updateEmailDto.email,
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('Email already in use');
    }
    const user = await this.fetchUserById(id);

    return this.secureUpdate(
      user,
      updateEmailDto.currentPassword,
      { email: updateEmailDto.email },
      'Email Changed',
      'Error updating email',
    );
  }

  async changeUserName(
    id: string,
    updateUserNameDto: UpdateUserNameDto,
  ): Promise<string> {
    const existing = await this.userRepository.findOneBy({
      username: updateUserNameDto.username,
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('Username already in use');
    }

    const user = await this.fetchUserById(id);

    return this.secureUpdate(
      user,
      updateUserNameDto.currentPassword,
      { username: updateUserNameDto.username },
      'Username Changed',
      'Error updating username',
    );
  }

  async fetchUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  private toUserResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return await argon2.verify(user.password, password);
  }

  private async secureUpdate(
    user: User,
    currentPassword: string,
    updates: Partial<User>,
    successMessage: string,
    errorMessage: string,
  ): Promise<string> {
    const passwordMatches = await this.verifyPassword(user, currentPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      this.userRepository.merge(user, { ...user, ...updates });
      await this.userRepository.save(user);
      return successMessage;
    } catch (error) {
      throw new InternalServerErrorException(`${errorMessage} ${error}`);
    }
  }
}
