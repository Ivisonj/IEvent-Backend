import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { GetUserNotificationsDTO } from './get-user-notifications.DTO';
import { NotificationDTO } from '../../dtos/notification.DTO';
import { INotificationRepository } from '../../repositories/notification-repository.interface';
import { GetUserNotificationsErrors } from './get-user-notifications.errors';
import { NotificationMapper } from '../../mappers/notification.map';

export type GetUserNotificationsResponse = Either<
  GetUserNotificationsErrors.UserNotFound | Error,
  NotificationDTO[]
>;

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    headerData: GetUserNotificationsDTO,
  ): Promise<GetUserNotificationsResponse> {
    const userExists = await this.notificationRepository.userExists(
      headerData.userId,
    );

    if (!userExists) return left(new GetUserNotificationsErrors.UserNotFound());

    const notifications = await this.notificationRepository.findNotifications(
      headerData.userId,
    );

    const dto = notifications.map((notification) =>
      NotificationMapper.toDTO(notification),
    );
    return right(dto);
  }
}
