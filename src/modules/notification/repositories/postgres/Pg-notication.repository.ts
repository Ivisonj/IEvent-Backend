import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/notification';
import { INotificationRepository } from '../notification-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { NotificationMapper } from '../../mappers/notification.map';

@Injectable()
export class PgNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async notify(notification: Notification): Promise<void> {
    const data = NotificationMapper.toPersistence(notification);
    await this.prisma.notification.create({
      data,
    });
  }
}
