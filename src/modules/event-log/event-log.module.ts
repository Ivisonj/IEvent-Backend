import { Module } from '@nestjs/common';
import { StartEventController } from './use-cases/start-event/start-event.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IEventLogRepository } from './repositories/event-log-repository.interface';
import { PgEventLogRepository } from './repositories/postgres/pg-event-log.repository';
import { StartEventUseCase } from './use-cases/start-event/start-event.useCase';
import { FinishEVentController } from './use-cases/finish-event/finish-event.controller';
import { FinishEventUseCase } from './use-cases/finish-event/finish-event.useCase';
import { INotificationRepository } from '../notification/repositories/notification-repository.interface';
import { PgNotificationRepository } from '../notification/repositories/postgres/Pg-notication.repository';

@Module({
  controllers: [StartEventController, FinishEVentController],
  providers: [
    PrismaService,
    {
      provide: IEventLogRepository,
      useClass: PgEventLogRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PgNotificationRepository,
    },
    StartEventUseCase,
    FinishEventUseCase,
  ],
  exports: [IEventLogRepository, INotificationRepository],
})
export class EventLogModule {}
