import { Participant as ParticipantPrisma } from '@prisma/client';
import { ParticipantDTO } from '../dtos/participant.DTO';
import { Participant } from '../domain/participant';
import { ParticpantStatus } from '../domain/participant';

export class ParticipantMapper {
  public static toDTO(participant: Participant): ParticipantDTO {
    return {
      id: participant.id,
      userId: participant.userId,
      eventId: participant.eventId,
      status: participant.status,
      presenceCount: participant.presenceCount,
      lateCount: participant.lateCount,
      absenceCount: participant.absenceCount,
    };
  }

  public static toDomain(raw: ParticipantPrisma): Participant {
    return Participant.create(
      {
        userId: raw.userId,
        eventId: raw.eventId,
        status: raw.status as ParticpantStatus,
        presenceCount: raw.presenceCount,
        lateCount: raw.lateCount,
        absenceCount: raw.absenceCount,
      },
      raw.id,
    );
  }

  public static toPersistence(participant: Participant) {
    return {
      id: participant.id,
      userId: participant.userId,
      eventId: participant.eventId,
      status: participant.status,
      presenceCount: participant.presenceCount,
      lateCount: participant.lateCount,
      absenceCount: participant.absenceCount,
    };
  }
}
