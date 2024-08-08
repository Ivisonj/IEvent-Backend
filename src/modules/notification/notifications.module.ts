import { Module } from '@nestjs/common';
import { GetUserNotificationsController } from './useCases/get-user-notifications/get-user-notifications.controller';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { INotificationRepository } from './repositories/notification-repository.interface';
import { PgNotificationRepository } from './repositories/postgres/Pg-notication.repository';
import { GetUserNotificationsUseCase } from './useCases/get-user-notifications/get-user-notifications.useCase';

@Module({
  controllers: [GetUserNotificationsController],
  providers: [
    PrismaService,
    GetUserNotificationsUseCase,
    {
      provide: INotificationRepository,
      useClass: PgNotificationRepository,
    },
  ],
  exports: [INotificationRepository],
})
export class NotificationModule {}
