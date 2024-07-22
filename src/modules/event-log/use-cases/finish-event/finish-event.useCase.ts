import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import { FinishEventDTORequest } from './finish-event.DTO';
import { FinishEventErrors } from './finish-event.errors';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { EventLogDTO } from '../../dtos/event-log.DTO';

export type FinishEventResponse = Either<
  FinishEventErrors.FailToFinishEvent | Error,
  EventLogDTO
>;

@Injectable()
export class FinishEventUseCase {
  constructor(private readonly eventLogRepository: IEventLogRepository) {}

  public async execute(
    eventId: string,
    userId: FinishEventDTORequest,
  ): Promise<FinishEventResponse> {
    const eventStarted = await this.eventLogRepository.eventStarted(eventId);

    if (!eventStarted) return left(new FinishEventErrors.RegisterNotFound());

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      eventId,
      userId.userId,
    );

    if (!isUserEventCreator)
      return left(new FinishEventErrors.FailToFinishEvent());

    const endTime = new Date();

    const eventEnded = await this.eventLogRepository.endEvent(eventId, endTime);

    if (!eventEnded) return left(new FinishEventErrors.FailToFinishEvent());

    const dto = EventLogMapper.toDTO(eventEnded);
    right(dto);
  }
}
