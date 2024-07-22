import { Module } from '@nestjs/common';
import { StartEventController } from './use-cases/start-event/start-event.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IEventLogRepository } from './repositories/event-log-repository.interface';
import { PgEventLogRepository } from './repositories/postgres/pg-event-log.repository';
import { StartEventUseCase } from './use-cases/start-event/start-event.useCase';

@Module({
  controllers: [StartEventController],
  providers: [
    PrismaService,
    {
      provide: IEventLogRepository,
      useClass: PgEventLogRepository,
    },
    StartEventUseCase,
  ],
  exports: [IEventLogRepository],
})
export class EventLogModule {}
