import { Module } from '@nestjs/common';
import { CreateParticipantController } from './use-cases/create-participation/create-participation.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { CreateParticipantUseCase } from './use-cases/create-participation/create-participation.useCase';
import { IParticipantRepository } from './repositories/participant-repository.interface';
import { PgParticipantRepository } from './repositories/postgres/Pg-participant.repository';
import { INotificationRepository } from '../notification/repositories/notification-repository.interface';
import { PgNotificationRepository } from '../notification/repositories/postgres/Pg-notication.repository';
@Module({
  controllers: [CreateParticipantController],
  providers: [
    PrismaService,
    CreateParticipantUseCase,
    {
      provide: IParticipantRepository,
      useClass: PgParticipantRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PgNotificationRepository,
    },
  ],
  exports: [IParticipantRepository],
})
export class ParticipantModule {}
