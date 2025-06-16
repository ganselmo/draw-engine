import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from '../shared/shared.module';
import { UserRelatedService } from './services/user-related.service';
import { UserRelatedController } from './controllers/user-related.controller';
import { Draw } from '../draw/entities/draw.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User,Draw])],
  controllers: [UserController,UserRelatedController],
  providers: [UserService,UserRelatedService],
  exports: [TypeOrmModule],
})
export class UserModule {}
