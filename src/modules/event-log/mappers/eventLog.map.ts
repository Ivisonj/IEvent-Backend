import { Event_Log as EventLogPrisma } from '@prisma/client';
import { EventLog } from '../domain/event-log';
import { EventLogDTO } from '../dtos/event-log.DTO';

export class EventLogMapper {
  public static toDTO(eventLog: EventLog): EventLogDTO {
    return {
      id: eventLog.id,
      eventId: eventLog.eventId,
      date: eventLog.date,
      start_time: eventLog.start_time,
      end_time: eventLog.end_time,
    };
  }

  public static toDomain(raw: EventLogPrisma): EventLog {
    const eventLogOrError = EventLog.create(
      {
        eventId: raw.eventId,
        date: raw.date,
        start_time: raw.start_time,
        end_time: raw.end_time,
      },
      raw.id,
    );
    return eventLogOrError;
  }

  public static async toPersistence(eventLog: EventLog) {
    return {
      id: eventLog.id,
      eventId: eventLog.eventId,
      date: eventLog.date,
      start_time: eventLog.start_time,
      end_time: eventLog.end_time,
    };
  }
}
