import { Event as EventPrisma } from '@prisma/client';
import { Recurrence as RecurrencePrisma } from '@prisma/client';
import { Event } from '../domain/Event';
import { EventDTO } from '../dtos/event.DTO';

export class EventMapper {
  public static toDTO(event: Event): EventDTO {
    return {
      id: event.id,
      userId: event.userId,
      name: event.name,
      description: event.description,
      address: event.address,
      isPublic: event.isPublic,
      once: event.once,
      isActive: event.isActive,
      recurrence: event.recurrence,
      custom_rules: event.custom_rules,
      tolerance_time: event.tolerance_time,
      absences_limit: event.absences_limit,
      delays_limit: event.delays_limit,
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
        description: raw.description,
        address: raw.address,
        isPublic: raw.isPublic,
        once: raw.once,
        isActive: raw.isActive,
        recurrence: recurrences.map((r) => r.day),
        custom_rules: raw.custom_rules,
        tolerance_time: raw.tolerance_time,
        absences_limit: raw.absences_limit,
        delays_limit: raw.delays_limit,
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
      description: event.description,
      address: event.address,
      isPublic: event.isPublic,
      once: event.once,
      isActive: event.isActive,
      recurrence: event.recurrence,
      custom_rules: event.custom_rules,
      tolerance_time: event.tolerance_time,
      absences_limit: event.absences_limit,
      delays_limit: event.delays_limit,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
    };

    const recurrencesData =
      event.recurrence?.map((day) => ({
        day,
      })) || [];

    return { eventData, recurrencesData };
  }
}
