import { Event } from 'src/modules/event/domain/Event';
import { EventLog } from '../domain/event-log';
import { Participant } from 'src/modules/participant/domain/participant';
import { Attendance } from 'src/modules/attendance/domain/attendance';

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
  abstract endEvent(eventLogId: string, time: Date): Promise<EventLog | null>;
  abstract findParticipants(eventId: string): Promise<Participant[] | null>;
  abstract participantsPresent(
    eventLogId: string,
  ): Promise<Attendance[] | null>;
  abstract putParticipantAbsences(
    attendance: Attendance[],
  ): Promise<Attendance[] | null>;
}
