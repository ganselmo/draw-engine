import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DrawModule } from './draw/draw.module';
import { TicketModule } from './ticket/ticket.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    DrawModule,
    TicketModule,
  ],
})
export class AppModule {}
