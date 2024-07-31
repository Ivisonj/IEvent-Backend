import { Module } from '@nestjs/common';
import { AttendanceController } from './use-cases/attendance/attendance.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IAttendanceRepository } from './repositories/attendance-repository.interface';
import { PgAttendanceRepository } from './repositories/postgres/pg-attendance.repository';
import { AttendanceUseCase } from './use-cases/attendance/attendance.useCase';

@Module({
  controllers: [AttendanceController],
  providers: [
    PrismaService,
    AttendanceUseCase,
    {
      provide: IAttendanceRepository,
      useClass: PgAttendanceRepository,
    },
  ],
  exports: [IAttendanceRepository],
})
export class AttendanceModule {}
