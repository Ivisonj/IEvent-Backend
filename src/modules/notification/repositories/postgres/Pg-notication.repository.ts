import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/notification';
import { INotificationRepository } from '../notification-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { NotificationMapper } from '../../mappers/notification.map';
import { User } from 'src/modules/user/domain/user/user';
import { UserMapper } from 'src/modules/user/mappers/user.map';

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

  async findNotifications(userId: string): Promise<Notification[] | null> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId: userId },
    });
    return !!notifications
      ? notifications.map((notification) =>
          NotificationMapper.toDomain(notification),
        )
      : null;
  }
}
