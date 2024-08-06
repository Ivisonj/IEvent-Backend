import { Injectable } from '@nestjs/common';
import { EventLog } from '../../domain/event-log';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { IEventLogRepository } from '../event-log-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { Event } from 'src/modules/event/domain/Event';
import { EventMapper } from 'src/modules/event/mappers/event.map';
import { Attendance } from 'src/modules/attendance/domain/attendance';
import { Participant } from 'src/modules/participant/domain/participant';
import { ParticipantMapper } from 'src/modules/participant/mappers/participant.map';
import { AttendanceMapper } from 'src/modules/attendance/mappers/attendance.map';

@Injectable()
export class PgEventLogRepository implements IEventLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerExists(eventLogId: string): Promise<EventLog | null> {
    const result = await this.prisma.event_Log.findUnique({
      where: { id: eventLogId },
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }

  async eventExists(eventId: string): Promise<Event | null> {
    const result = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });

    return !!result ? EventMapper.toDomain(result, result.recurrence) : null;
  }

  async eventStarted(eventId: string): Promise<EventLog | null> {
    const result = await this.prisma.event_Log.findFirst({
      where: {
        eventId: eventId,
        AND: {
          end_time: null,
        },
      },
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }

  async eventFinished(eventLogId: string): Promise<EventLog | null> {
    const result = await this.prisma.event_Log.findUnique({
      where: { id: eventLogId, AND: { end_time: null } },
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }

  async isUserEventCreator(
    eventId: string,
    userId: string,
  ): Promise<boolean | null> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });

    return event ? event.userId === userId : null;
  }

  async checkDate(eventId: string, date: Date): Promise<boolean | null> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });

    if (!event) return null;

    const dayOfWeek = date.getDay();

    if (!event.once) {
      const eventDateMatch = event.recurrence.some(
        (recurrence) => recurrence.day === dayOfWeek,
      );
      return eventDateMatch;
    } else {
      const startDate = new Date(event.start_date);
      return date.getTime() === startDate.getTime();
    }
  }

  async create(event: EventLog): Promise<EventLog | null> {
    const data = await EventLogMapper.toPersistence(event);
    const result = await this.prisma.event_Log.create({
      data,
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }

  async endEvent(eventLogId: string, time): Promise<EventLog | null> {
    const result = await this.prisma.event_Log.update({
      where: { id: eventLogId },
      data: { end_time: time },
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }

  async findParticipants(eventId: string): Promise<Participant[] | null> {
    const participants = await this.prisma.participant.findMany({
      where: { eventId: eventId },
    });
    return !!participants
      ? participants.map((participant) =>
          ParticipantMapper.toDomain(participant),
        )
      : null;
  }

  async participantsPresent(eventLogId: string): Promise<Attendance[] | null> {
    const participantsPresent = await this.prisma.attendance.findMany({
      where: { eventLogId: eventLogId },
    });
    return !!participantsPresent
      ? participantsPresent.map((participant) =>
          AttendanceMapper.toDomain(participant),
        )
      : null;
  }

  async putParticipantAbsences(
    attendance: Attendance[],
  ): Promise<Attendance[] | null> {
    const participantAbsences = attendance.map((attendance) => {
      return this.prisma.attendance.create({
        data: {
          userId: attendance.userId,
          eventId: attendance.eventId,
          eventLogId: attendance.eventLogId,
          checkedInAt: attendance.checkedInAt,
          status: attendance.status,
        },
      });
    });

    const result = await this.prisma.$transaction(participantAbsences);

    return !!result
      ? result.map((attendance) => AttendanceMapper.toDomain(attendance))
      : null;
  }
}
