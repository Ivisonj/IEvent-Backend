import { User } from 'src/modules/user/domain/user/user';
import { Notification } from '../domain/notification';

export abstract class INotificationRepository {
  abstract notify(notification: Notification): Promise<void>;
  abstract userExists(userId: string): Promise<User | null>;
  abstract findUserNotifications(
    userId: string,
  ): Promise<Notification[] | null>;
}
