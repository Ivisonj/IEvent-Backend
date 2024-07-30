import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import { FinishEventHeaderDataDTO } from './finish-event.DTO';
import { FinishEventErrors } from './finish-event.errors';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import { CustomDate } from 'src/shared/application/customDate';
import { INotificationRepository } from 'src/modules/notification/repositories/notification-repository.interface';
import {
  Notification,
  NotificationTypes,
} from 'src/modules/notification/domain/notification';

export type FinishEventResponse = Either<
  FinishEventErrors.FailToFinishEvent | Error,
  EventLogDTO
>;

@Injectable()
export class FinishEventUseCase {
  constructor(
    private readonly eventLogRepository: IEventLogRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    registerId: string,
    eventId: string,
    headerData: FinishEventHeaderDataDTO,
  ): Promise<FinishEventResponse> {
    const registerExists =
      await this.eventLogRepository.registerExists(registerId);

    if (!registerExists) return left(new FinishEventErrors.RegisterNotFound());

    const eventFinished =
      await this.eventLogRepository.eventFinished(registerId);

    if (!eventFinished)
      return left(new FinishEventErrors.EventAlreadyFinished());

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      eventId,
      headerData.userId,
    );

    if (!isUserEventCreator)
      return left(new FinishEventErrors.FailToFinishEvent());

    const endTime = CustomDate.fixTimezoneoffset(new Date());

    const eventEnded = await this.eventLogRepository.endEvent(
      registerId,
      endTime,
    );

    if (!eventEnded) return left(new FinishEventErrors.FailToFinishEvent());

    const notification = Notification.create({
      userId: headerData.userId,
      eventId: eventId,
      message: 'O evento terminou!',
      type: 'alert' as NotificationTypes,
      createdAt: CustomDate.fixTimezoneoffset(new Date()),
      readed: false,
    });

    await this.notificationRepository.notify(notification);

    const dto = EventLogMapper.toDTO(eventEnded);
    return right(dto);
  }
}
