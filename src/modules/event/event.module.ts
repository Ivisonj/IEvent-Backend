import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { CreateEventController } from './use-cases/create-event/create-event.controller';
import { IEventRepository } from './repositories/event-repository.interface';
import { PgEventRepository } from './repositories/postgres/pg-event.repository';
import { CreateEventUseCase } from './use-cases/create-event/create-event.useCase';
import { GetEventsByUserIdController } from './use-cases/get-event-by-userId/get-event-by-userId.controller';
import { GetEventsByUserIdUseCase } from './use-cases/get-event-by-userId/get-event-by-userId.useCase';
import { GetEventByIdController } from './use-cases/get-event-by-id/get-event-by-id.controller';
import { GetEventByIdUseCase } from './use-cases/get-event-by-id/get-event-by-id.useCase';

@Module({
  controllers: [
    CreateEventController,
    GetEventsByUserIdController,
    GetEventByIdController,
  ],
  providers: [
    PrismaService,
    {
      provide: IEventRepository,
      useClass: PgEventRepository,
    },
    CreateEventUseCase,
    GetEventsByUserIdUseCase,
    GetEventByIdUseCase,
  ],
  exports: [IEventRepository],
})
export class EventModule {}
