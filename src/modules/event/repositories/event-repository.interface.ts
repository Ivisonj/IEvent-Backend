import { Event } from '../domain/event';

export abstract class IEventRepository {
  abstract create(event: Event): Promise<Event | null>;
  abstract findByUserId(userId: string): Promise<Event[] | null>;
}
