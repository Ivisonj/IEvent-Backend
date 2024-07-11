import { Injectable } from '@nestjs/common';
import { RegisterEvents } from '../../domain/register-events';
import { RegisterEventsMapper } from '../../mappers/register-events.map';
import { IRegisterEventsRepository } from '../register-events-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { Event } from 'src/modules/event/domain/Event';
import { EventMapper } from 'src/modules/event/mappers/event.map';

@Injectable()
export class PgRegisterEventsRepository implements IRegisterEventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async eventExists(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { recurrence: true },
    });
    return event ? EventMapper.toDomain(event, event.recurrence) : null;
  }

  async checkDate(id: string, date: Date): Promise<boolean | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
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
      return date === startDate;
    }
  }

  async create(event: RegisterEvents): Promise<RegisterEvents | null> {
    const data = await RegisterEventsMapper.toPersistence(event);
    const result = await this.prisma.register_Events.create({
      data,
    });

    return !!result ? RegisterEventsMapper.toDomain(result) : null;
  }
}
