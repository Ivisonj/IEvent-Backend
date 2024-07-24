import { EventLog } from 'src/modules/event-log/domain/event-log';
import { Attendance } from '../domain/attendance';
import { Participant } from 'src/modules/participant/domain/participant';
import { Event } from 'src/modules/event/domain/Event';

export abstract class IAttendanceRepository {
  abstract create(attendance: Attendance): Promise<Attendance | null>;
  abstract isParticipant(
    userId: string,
    eventId: string,
  ): Promise<Participant | null>;
  abstract registerExists(registerId: string): Promise<EventLog | null>;
  abstract getEvent(eventId: string): Promise<Event | null>;
  abstract eventStartTime(registerId: string): Promise<Date | null>;
}
