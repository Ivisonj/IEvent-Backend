import { Notification } from '../domain/notification';

export abstract class INotificationRepository {
  abstract notify(notification: Notification): Promise<void>;
}
