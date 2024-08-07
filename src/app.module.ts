import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './shared/infra/database/prisma/prisma-service.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/user/use-cases/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { ParticipantModule } from './modules/participant/participationRequest.module';
import { EventLogModule } from './modules/event-log/event-log.module';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EventModule,
    ParticipantModule,
    EventLogModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
