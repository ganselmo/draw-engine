import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TokenBlacklistService } from './services/token-blacklist.service';

@Module({
  imports:[
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRATION_TIME')},
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,TokenBlacklistService],
})
export class AuthModule {}
