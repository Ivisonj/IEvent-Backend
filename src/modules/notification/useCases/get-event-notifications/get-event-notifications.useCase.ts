import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { NotificationDTO } from '../../dtos/notification.DTO';
import { INotificationRepository } from '../../repositories/notification-repository.interface';
import { GetEventNotificationsHeaderDataDTO } from './get-event-notifications.DTO';
import { GetEventNotificationsErrors } from './get-event-notifications.errors';
import { NotificationMapper } from '../../mappers/notification.map';

export type GetEventNotificationsResponse = Either<
  GetEventNotificationsErrors.EventNotFound | Error,
  NotificationDTO[]
>;

@Injectable()
export class GetEventNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    eventId: string,
    headerData: GetEventNotificationsHeaderDataDTO,
  ): Promise<GetEventNotificationsResponse> {
    const eventExists = await this.notificationRepository.eventExists(eventId);

    if (!eventExists)
      return left(new GetEventNotificationsErrors.EventNotFound());

    const isUserEventCreator =
      await this.notificationRepository.isUserEventCreator(
        eventId,
        headerData.userId,
      );

    if (!isUserEventCreator)
      return left(new GetEventNotificationsErrors.UserAndEventNotMatch());

    const findEventNotifications =
      await this.notificationRepository.findEventNotifications(eventId);

    const dto = findEventNotifications.map((notification) =>
      NotificationMapper.toDTO(notification),
    );
    return right(dto);
  }
}
