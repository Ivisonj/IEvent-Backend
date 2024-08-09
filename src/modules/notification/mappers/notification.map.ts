import { Notification as NotificationPrisma } from '@prisma/client';
import { NotificationDTO } from '../dtos/notification.DTO';
import {
  Notification,
  NotificationTypes,
  SenderTypes,
} from '../domain/notification';

export class NotificationMapper {
  public static toDTO(notification: Notification): NotificationDTO {
    return {
      id: notification.id,
      userId: notification.userId,
      eventId: notification.eventId,
      message: notification.message,
      type: notification.type,
      sender: notification.sender,
      createdAt: notification.createdAt,
      readed: notification.readed,
    };
  }

  public static toDomain(raw: NotificationPrisma): Notification {
    const notificationOrError = Notification.create(
      {
        userId: raw.userId,
        eventId: raw.eventId,
        message: raw.message,
        type: raw.type as NotificationTypes,
        sender: raw.sender as SenderTypes,
        createdAt: raw.createdAt,
        readed: raw.readed,
      },
      raw.id,
    );
    return notificationOrError;
  }

  public static toPersistence(notification: Notification) {
    return {
      id: notification.id,
      userId: notification.userId,
      eventId: notification.eventId,
      message: notification.message,
      type: notification.type,
      sender: notification.sender,
      createdAt: notification.createdAt,
      readed: notification.readed,
    };
  }
}
