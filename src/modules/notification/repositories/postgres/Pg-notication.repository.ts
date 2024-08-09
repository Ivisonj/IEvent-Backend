import { Injectable } from '@nestjs/common';
import { Notification, SenderTypes } from '../../domain/notification';
import { INotificationRepository } from '../notification-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { NotificationMapper } from '../../mappers/notification.map';
import { User } from 'src/modules/user/domain/user/user';
import { UserMapper } from 'src/modules/user/mappers/user.map';
import { EventMapper } from 'src/modules/event/mappers/event.map';
import { Event } from 'src/modules/event/domain/Event';

@Injectable()
export class PgNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async notify(notification: Notification): Promise<void> {
    const data = NotificationMapper.toPersistence(notification);
    await this.prisma.notification.create({
      data,
    });
  }

  async userExists(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return !!user ? UserMapper.toDomain(user) : null;
  }

  async eventExists(eventId: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });
    return !!event ? EventMapper.toDomain(event, event.recurrence) : null;
  }

  async findUserNotifications(userId: string): Promise<Notification[] | null> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId: userId, AND: { sender: SenderTypes.event } },
    });
    return !!notifications
      ? notifications.map((notification) =>
          NotificationMapper.toDomain(notification),
        )
      : null;
  }

  async findEventNotifications(
    eventId: string,
  ): Promise<Notification[] | null> {
    const notifications = await this.prisma.notification.findMany({
      where: { eventId: eventId, AND: { sender: SenderTypes.user } },
    });
    return !!notifications
      ? notifications.map((notification) =>
          NotificationMapper.toDomain(notification),
        )
      : null;
  }

  async isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<Event | null> {
    const result = await this.prisma.event.findFirst({
      where: { id: eventId, userId: userId },
      include: { recurrence: true },
    });
    return !!result ? EventMapper.toDomain(result, result.recurrence) : null;
  }
}
