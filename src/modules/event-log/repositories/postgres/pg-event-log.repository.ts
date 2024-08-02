import { Injectable } from '@nestjs/common';
import { EventLog } from '../../domain/event-log';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { IEventLogRepository } from '../event-log-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { Event } from 'src/modules/event/domain/Event';
import { EventMapper } from 'src/modules/event/mappers/event.map';
import { CustomDate } from 'src/shared/application/customDate';
import { AttendanceStatus } from 'src/modules/attendance/domain/attendance';

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

  async endEvent(
    eventLogId: string,
    eventId: string,
    time,
  ): Promise<EventLog | null> {
    const result = await this.prisma.event_Log.update({
      where: { id: eventLogId },
      data: { end_time: time },
    });

    const participants = await this.prisma.participant.findMany({
      where: { eventId: eventId },
      select: { userId: true },
    });

    const participantsPresent = await this.prisma.attendance.findMany({
      where: { eventLogId: eventLogId },
    });

    const attendedUserIds = new Set(participantsPresent.map((p) => p.userId));

    const absentees = participants.filter(
      (p) => !attendedUserIds.has(p.userId),
    );

    if (participantsPresent) {
      const absenceUpdates = absentees.map((absense) =>
        this.prisma.attendance.createMany({
          data: {
            userId: absense.userId,
            eventId: eventId,
            eventLogId: eventLogId,
            checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
            status: AttendanceStatus.absence,
          },
        }),
      );

      await this.prisma.$transaction(absenceUpdates);
    } else {
      const absenceUpdates = participants.map((absence) =>
        this.prisma.attendance.createMany({
          data: {
            userId: absence.userId,
            eventId: eventId,
            eventLogId: eventLogId,
            checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
            status: AttendanceStatus.absence,
          },
        }),
      );
      await this.prisma.$transaction(absenceUpdates);
    }

    return !!result ? EventLogMapper.toDomain(result) : null;
  }
}
