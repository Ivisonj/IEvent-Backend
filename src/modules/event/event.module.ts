import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { CreateEventController } from './use-cases/create-event/create-event.controller';
import { IEventRepository } from './repositories/event-repository.interface';
import { PgEventRepository } from './repositories/postgres/pg-event.repository';
import { CreateEventUseCase } from './use-cases/create-event/create-event.useCase';

@Module({
  controllers: [CreateEventController],
  providers: [
    PrismaService,
    {
      provide: IEventRepository,
      useClass: PgEventRepository,
    },
    CreateEventUseCase,
  ],
  exports: [IEventRepository],
})
export class EventModule {}
