import { Injectable } from '@nestjs/common';
import { EventLog } from '../../domain/event-log';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { IEventLogRepository } from '../event-log-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { Event } from 'src/modules/event/domain/Event';
import { EventMapper } from 'src/modules/event/mappers/event.map';

@Injectable()
export class PgEventLogRepository implements IEventLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async eventExists(eventId: string): Promise<Event | null> {
    const result = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });

    return !!result ? EventMapper.toDomain(result, result.recurrence) : null;
  }

  async eventStarted(eventId: string): Promise<EventLog | null> {
    const result = await this.prisma.register_Events.findFirst({
      where: { eventId: eventId },
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
    const result = await this.prisma.register_Events.create({
      data,
    });

    return !!result ? EventLogMapper.toDomain(result) : null;
  }
}