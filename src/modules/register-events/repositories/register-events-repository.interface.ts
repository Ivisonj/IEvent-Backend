import { Event } from 'src/modules/event/domain/Event';
import { RegisterEvents } from '../domain/register-events';

export abstract class IRegisterEventsRepository {
  abstract eventExists(id: string): Promise<Event | null>;
  abstract checkDate(id: string, date: Date): Promise<boolean | null>;
  abstract create(event: RegisterEvents): Promise<RegisterEvents | null>;
}
