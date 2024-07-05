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
import { GetEventByNameController } from './use-cases/get-event-by-name/get-event-by-name.controller';
import { GetEventByNameUseCase } from './use-cases/get-event-by-name/get-event-by-name.useCase';
import { UpdateEventController } from './use-cases/update-event/update-event.controller';
import { UpdateEventUseCase } from './use-cases/update-event/update-event.useCase';
import { DeleteEventController } from './use-cases/delete-event/delete-event.controller';
import { DeteleEventUseCase } from './use-cases/delete-event/delete-event.useCase';
import { GetEventByParticipationController } from './use-cases/get-event-participating/get-event-by-participation.controller';
import { GetEventByParticipationUseCase } from './use-cases/get-event-participating/get-event-by-participation.useCase';

@Module({
  controllers: [
    CreateEventController,
    GetEventsByUserIdController,
    GetEventByIdController,
    GetEventByNameController,
    GetEventByParticipationController,
    UpdateEventController,
    DeleteEventController,
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
    GetEventByNameUseCase,
    GetEventByParticipationUseCase,
    UpdateEventUseCase,
    DeteleEventUseCase,
  ],
  exports: [IEventRepository],
})
export class EventModule {}
