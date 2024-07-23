import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import { UserIdDTO, EventIdDTO } from './finish-event.DTO';
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
    registerId: string,
    eventId: EventIdDTO,
    userId: UserIdDTO,
  ): Promise<FinishEventResponse> {
    const eventStarted = await this.eventLogRepository.exists(registerId);

    if (!eventStarted) return left(new FinishEventErrors.RegisterNotFound());

    console.log('eventId userCase', eventId.eventId);

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      eventId.eventId,
      userId.userId,
    );

    if (!isUserEventCreator)
      return left(new FinishEventErrors.FailToFinishEvent());

    const endTime = new Date();

    const eventEnded = await this.eventLogRepository.endEvent(
      registerId,
      endTime,
    );

    if (!eventEnded) return left(new FinishEventErrors.FailToFinishEvent());

    const dto = EventLogMapper.toDTO(eventEnded);
    return right(dto);
  }
}
