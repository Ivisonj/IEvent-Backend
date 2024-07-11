import { Register_Events as RegisterEventsPrisma } from '@prisma/client';
import { RegisterEvents } from '../domain/register-events';
import { RegisterEventsDTO } from '../dtos/register-events.DTO';

export class RegisterEventsMapper {
  public static toDTO(registerEvents: RegisterEvents): RegisterEventsDTO {
    return {
      id: registerEvents.id,
      eventId: registerEvents.eventId,
      date: registerEvents.date,
      start_time: registerEvents.start_time,
      end_time: registerEvents.end_time,
    };
  }

  public static toDomain(raw: RegisterEventsPrisma): RegisterEvents {
    const registerEventsOrError = RegisterEvents.create(
      {
        eventId: raw.eventId,
        date: raw.date,
        start_time: raw.start_time,
        end_time: raw.end_time,
      },
      raw.id,
    );
    return registerEventsOrError;
  }

  public static async toPersistence(registerEvents: RegisterEvents) {
    return {
      id: registerEvents.id,
      eventId: registerEvents.eventId,
      date: registerEvents.date,
      start_time: registerEvents.start_time,
      end_time: registerEvents.end_time,
    };
  }
}
