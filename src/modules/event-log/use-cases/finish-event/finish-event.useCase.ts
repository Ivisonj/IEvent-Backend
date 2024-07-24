import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import { UserIdDTO, EventIdDTO } from './finish-event.DTO';
import { FinishEventErrors } from './finish-event.errors';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import { CustomDate } from 'src/shared/application/customDate';

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
    const registerExists =
      await this.eventLogRepository.registerExists(registerId);

    if (!registerExists) return left(new FinishEventErrors.RegisterNotFound());

    const eventFinished =
      await this.eventLogRepository.eventFinished(registerId);

    if (!eventFinished)
      return left(new FinishEventErrors.EventAlreadyFinished());

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      eventId.eventId,
      userId.userId,
    );

    if (!isUserEventCreator)
      return left(new FinishEventErrors.FailToFinishEvent());

    const endTime = CustomDate.fixTimezoneoffset(new Date());

    const eventEnded = await this.eventLogRepository.endEvent(
      registerId,
      endTime,
    );

    if (!eventEnded) return left(new FinishEventErrors.FailToFinishEvent());

    const dto = EventLogMapper.toDTO(eventEnded);
    return right(dto);
  }
}
