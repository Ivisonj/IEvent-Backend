import { Event } from 'src/modules/event/domain/Event';
import { EventLog } from '../domain/event-log';

export abstract class IEventLogRepository {
  abstract registerExists(eventLogId: string): Promise<EventLog | null>;
  abstract eventExists(eventId: string): Promise<Event | null>;
  abstract create(event: EventLog): Promise<EventLog | null>;
  abstract eventStarted(eventId: string): Promise<EventLog | null>;
  abstract eventFinished(eventLogId: string): Promise<EventLog | null>;
  abstract isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<boolean | null>;
  abstract checkDate(eventId: string, date: Date): Promise<boolean | null>;
  abstract endEvent(
    eventLogId: string,
    eventId: string,
    time: Date,
  ): Promise<EventLog | null>;
}
