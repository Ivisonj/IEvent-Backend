import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { EventLog } from '../../domain/event-log';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import { StartEventDTORequest } from './start-event.DTO';
import { StartEventErrors } from './start-event.errors';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import { CustomDate } from 'src/shared/application/customDate';

export type StartEventResponse = Either<
  StartEventErrors.EventNotExists | Error,
  EventLogDTO
>;

@Injectable()
export class StartEventUseCase {
  constructor(private readonly eventLogRepository: IEventLogRepository) {}

  public async execute(
    eventId: string,
    userId: StartEventDTORequest,
  ): Promise<StartEventResponse> {
    const eventExists = await this.eventLogRepository.eventExists(eventId);

    if (!eventExists) return left(new StartEventErrors.EventNotExists());

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      eventId,
      userId.userId,
    );

    if (!isUserEventCreator)
      return left(new StartEventErrors.FailToStartEvent());

    const eventStarted = await this.eventLogRepository.eventStarted(eventId);

    if (eventStarted) return left(new StartEventErrors.FailSolicitation());

    const currentDate = CustomDate.customHours(new Date());

    const eventDateMatch = await this.eventLogRepository.checkDate(
      eventId,
      currentDate,
    );

    if (!eventDateMatch)
      return left(new StartEventErrors.EventCanNotStartToday());

    const registerEventOrError = EventLog.create({
      eventId: eventId,
      date: currentDate,
      start_time: CustomDate.fixTimezoneoffset(new Date()),
      end_time: null,
    });

    const event = await this.eventLogRepository.create(registerEventOrError);
    const dto = EventLogMapper.toDTO(event);
    return right(dto);
  }
}
