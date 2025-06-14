import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenUtilsService } from './utils/token-utils.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRATION_TIME') },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    TokenBlacklistService,
    TokenUtilsService
  ],
  exports: [TokenBlacklistService,TokenUtilsService, JwtStrategy, JwtModule,],
})
export class SharedModule {}
