import { User } from 'src/modules/user/domain/user/user';
import { Participant } from '../domain/participant';
import { Event } from 'src/modules/event/domain/Event';

export abstract class IParticipantRepository {
  abstract userExists(id: string): Promise<User | null>;
  abstract eventExists(id: string): Promise<Event | null>;
  abstract solicitationExists(
    userId: string,
    eventId: string,
  ): Promise<Participant | null>;
  abstract create(participant: Participant): Promise<Participant | null>;
}
