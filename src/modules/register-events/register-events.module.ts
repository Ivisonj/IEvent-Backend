import { Module } from '@nestjs/common';
import { RegisterEventController } from './use-cases/register-event/register-event.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IRegisterEventsRepository } from './repositories/register-events-repository.interface';
import { PgRegisterEventsRepository } from './repositories/postgres/pg-register-events.repository';
import { RegisterEventUseCase } from './use-cases/register-event/register-event.useCase';

@Module({
  controllers: [RegisterEventController],
  providers: [
    PrismaService,
    {
      provide: IRegisterEventsRepository,
      useClass: PgRegisterEventsRepository,
    },
    RegisterEventUseCase,
  ],
  exports: [IRegisterEventsRepository],
})
export class RegisterEventModule {}
