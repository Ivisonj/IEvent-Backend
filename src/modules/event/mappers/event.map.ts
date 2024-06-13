import { Event as EventPrisma } from '@prisma/client';
import { Recurrence as RecurrencePrisma } from '@prisma/client';
import { Event } from '../domain/event';
import { EventDTO } from '../dtos/event.DTO';

export class EventMapper {
  public static toDTO(event: Event): EventDTO {
    return {
      id: event.id,
      userId: event.userId,
      name: event.name,
      address: event.address,
      isPublic: event.isPublic,
      once: event.once,
      recurrence: event.recurrence,
      custom_rules: event.custom_rules,
      absences_limit: event.absences_limit,
      max_absences: event.max_absences,
      delays_limit: event.delays_limit,
      max_delays: event.max_delays,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
    };
  }

  public static toDomain(
    raw: EventPrisma,
    recurrences: RecurrencePrisma[],
  ): Event {
    const eventOrError = Event.create(
      {
        userId: raw.userId,
        name: raw.name,
        address: raw.address,
        isPublic: raw.isPublic,
        once: raw.once,
        recurrence: recurrences.map((r) => r.day),
        custom_rules: raw.custom_rules,
        absences_limit: raw.absences_limit,
        max_absences: raw.max_absences,
        delays_limit: raw.delays_limit,
        max_delays: raw.max_delays,
        start_date: raw.start_date,
        end_date: raw.end_date,
        start_time: raw.start_time,
        end_time: raw.end_time,
      },
      raw.id,
    );
    return eventOrError;
  }

  public static async toPersistence(event: Event): Promise<any> {
    const eventData = {
      userId: event.userId,
      name: event.name,
      address: event.address,
      isPublic: event.isPublic,
      once: event.once,
      custom_rules: event.custom_rules,
      absences_limit: event.absences_limit,
      max_absences: event.max_absences,
      delays_limit: event.delays_limit,
      max_delays: event.max_delays,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
    };

    const recurrencesData =
      event.recurrence?.map((day) => ({
        day,
        recurrence: event.recurrence.length > 1 ? true : false,
      })) || [];

    return { eventData, recurrencesData };
  }
}
