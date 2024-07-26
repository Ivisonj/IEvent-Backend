import { Module } from '@nestjs/common';
import { CreateParticipantController } from './use-cases/create-participation/create-participation.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { CreateParticipantUseCase } from './use-cases/create-participation/create-participation.useCase';
import { IParticipantRepository } from './repositories/participant-repository.interface';
import { PgParticipantRepository } from './repositories/postgres/Pg-participant.repository';
import { INotificationRepository } from '../notification/repositories/notification-repository.interface';
import { PgNotificationRepository } from '../notification/repositories/postgres/Pg-notication.repository';
import { ResponseSolicitationController } from './use-cases/response-solicitation/response-solicitation.controller';
import { ResponseSolicitationUseCase } from './use-cases/response-solicitation/response-solicitation.useCase';
import { GetParticipantsController } from './use-cases/get-participants/get-participants.controller';
import { GetParticipantsUseCase } from './use-cases/get-participants/get-participants.useCase';
@Module({
  controllers: [
    CreateParticipantController,
    ResponseSolicitationController,
    GetParticipantsController,
  ],
  providers: [
    PrismaService,
    CreateParticipantUseCase,
    ResponseSolicitationUseCase,
    GetParticipantsUseCase,
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
