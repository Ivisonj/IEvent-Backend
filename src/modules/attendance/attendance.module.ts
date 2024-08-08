import { Module } from '@nestjs/common';
import { AttendanceController } from './use-cases/attendance/attendance.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IAttendanceRepository } from './repositories/attendance-repository.interface';
import { PgAttendanceRepository } from './repositories/postgres/pg-attendance.repository';
import { AttendanceUseCase } from './use-cases/attendance/attendance.useCase';
import { INotificationRepository } from '../notification/repositories/notification-repository.interface';
import { PgNotificationRepository } from '../notification/repositories/postgres/Pg-notication.repository';

@Module({
  controllers: [AttendanceController],
  providers: [
    PrismaService,
    AttendanceUseCase,
    {
      provide: IAttendanceRepository,
      useClass: PgAttendanceRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PgNotificationRepository,
    },
  ],
  exports: [IAttendanceRepository],
})
export class AttendanceModule {}

// Testar o controle de faltas e atrasos da Tabela participant e enviar notificação ao atingor limites de faltas e atrasos
