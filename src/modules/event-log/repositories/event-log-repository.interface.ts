import { Event } from 'src/modules/event/domain/Event';
import { EventLog } from '../domain/event-log';

export abstract class IEventLogRepository {
  abstract eventExists(eventId: string): Promise<Event | null>;
  abstract eventStarted(eventId: string): Promise<EventLog | null>;
  abstract isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<boolean | null>;
  abstract checkDate(eventId: string, date: Date): Promise<boolean | null>;
  abstract create(event: EventLog): Promise<EventLog | null>;
}
