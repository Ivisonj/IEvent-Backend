import { User } from 'src/modules/user/domain/user/user';
import { Event } from 'src/modules/event/domain/Event';
import { Notification } from '../domain/notification';

export abstract class INotificationRepository {
  abstract notify(notification: Notification): Promise<void>;
  abstract userExists(userId: string): Promise<User | null>;
  abstract eventExists(eventId: string): Promise<Event | null>;
  abstract findUserNotifications(
    userId: string,
  ): Promise<Notification[] | null>;
  abstract findEventNotifications(
    eventId: string,
  ): Promise<Notification[] | null>;
  abstract isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<Event | null>;
}
