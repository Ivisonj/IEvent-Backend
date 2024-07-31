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
  abstract eventLogExists(eventLogId: string): Promise<EventLog | null>;
  abstract getEvent(eventId: string): Promise<Event | null>;
  abstract eventStartTime(eventLogId: string): Promise<Date | null>;
  abstract attendanceRecordExists(
    event_Log: string,
    userId: string,
  ): Promise<Attendance | null>;
}
