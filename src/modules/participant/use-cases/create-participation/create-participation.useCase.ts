import { Injectable } from '@nestjs/common';
import { Participant, ParticpantStatus } from '../../domain/participant';
import { Either, left, right } from 'src/shared/application/Either';
import { IParticipantRepository } from '../../repositories/participant-repository.interface';
import { INotificationRepository } from 'src/modules/notification/repositories/notification-repository.interface';
import { CreateParticipantDTOResponse } from './create-participation.DTO';
import { CreateParticipantErrors } from './create-participation.errors';
import { ParticipantMapper } from '../../mappers/participant.map';
import {
  Notification,
  NotificationTypes,
} from 'src/modules/notification/domain/notification';

export type CreateParticipantResponse = Either<
  CreateParticipantErrors.UserNotExists | Error,
  CreateParticipantDTOResponse
>;

@Injectable()
export class CreateParticipantUseCase {
  constructor(
    private readonly participantRepository: IParticipantRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    userId: string,
    eventId: string,
  ): Promise<CreateParticipantResponse> {
    const userExists = await this.participantRepository.userExists(userId);

    if (!userExists) return left(new CreateParticipantErrors.UserNotExists());

    const eventExists = await this.participantRepository.eventExists(eventId);

    if (!eventExists) return left(new CreateParticipantErrors.EventNotExists());

    const solicitationExists =
      await this.participantRepository.solicitationExists(userId, eventId);

    if (solicitationExists)
      return left(new CreateParticipantErrors.FailToSentSolicitation());

    const participantOrError = Participant.create({
      userId: userId,
      eventId: eventId,
      status: ParticpantStatus.pending,
    });

    const participationRequest =
      await this.participantRepository.create(participantOrError);
    const participationDTO = ParticipantMapper.toDTO(participationRequest);

    const notificationOrError = Notification.create({
      userId: userId,
      eventId: eventId,
      message: 'Você tem uma nova solicitação',
      type: 'solicitation' as NotificationTypes,
      createdAt: new Date(),
      readed: false,
    });

    await this.notificationRepository.notify(notificationOrError);

    return right(participationDTO);
  }
}
