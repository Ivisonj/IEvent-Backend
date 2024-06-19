import { Event } from '../domain/Event';

export abstract class IEventRepository {
  abstract create(event: Event): Promise<Event | null>;
  abstract exists(id: string): Promise<Event | null>;
  abstract update(id: string, updateData: Event): Promise<Event | null>;
  abstract findByUserId(userId: string): Promise<Event[] | null>;
  abstract findById(id: string): Promise<Event[] | null>;
  abstract findByName(name: string): Promise<Event[] | null>;
}
