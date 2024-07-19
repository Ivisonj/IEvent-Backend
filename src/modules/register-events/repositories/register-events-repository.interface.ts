import { Event } from 'src/modules/event/domain/Event';
import { RegisterEvents } from '../domain/register-events';

export abstract class IRegisterEventsRepository {
  abstract eventExists(eventId: string): Promise<Event | null>;
  abstract isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<boolean | null>;
  abstract checkDate(eventId: string, date: Date): Promise<boolean | null>;
  abstract create(event: RegisterEvents): Promise<RegisterEvents | null>;
}
