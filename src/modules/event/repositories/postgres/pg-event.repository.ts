import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Event } from '../../domain/Event';
import { EventMapper } from '../../mappers/event.map';
import { IEventRepository } from '../event-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';

@Injectable()
export class PgEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { recurrences: true },
    });
    return event ? EventMapper.toDomain(event, event.recurrences) : null;
  }

  async create(event: Event): Promise<Event> {
    const { eventData, recurrencesData } =
      await EventMapper.toPersistence(event);

    const result = await this.prisma.$transaction(async (prisma) => {
      const createdEvent = await prisma.event.create({
        data: eventData,
      });

      const recurrences = await Promise.all(
        recurrencesData.map((day) =>
          prisma.recurrence.create({
            data: {
              id: uuid(),
              eventId: createdEvent.id,
              day: day.day,
            },
          }),
        ),
      );

      return { createdEvent, recurrences };
    });

    return EventMapper.toDomain(result.createdEvent, result.recurrences);
  }

  async findByUserId(userId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { userId },
      include: { recurrences: true },
    });

    return events.map((event) =>
      EventMapper.toDomain(event, event.recurrences),
    );
  }

  async findById(id: string): Promise<Event[]> {
    const event = await this.prisma.event.findMany({
      where: { id },
      include: { recurrences: true },
    });

    if (!event) return null;

    return event.map((event) => EventMapper.toDomain(event, event.recurrences));
  }

  async findByName(name: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        name: {
          startsWith: name,
          mode: 'insensitive',
        },
      },
      include: { recurrences: true },
    });

    return events.map((event) =>
      EventMapper.toDomain(event, event.recurrences),
    );
  }

  async update(id: string, updateData: Event): Promise<Event> {
    const { eventData, recurrencesData } =
      await EventMapper.toPersistence(updateData);

    const result = await this.prisma.$transaction(async (prisma) => {
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: eventData,
      });

      if (recurrencesData) {
        await prisma.recurrence.deleteMany({
          where: { eventId: id },
        });

        const updatedRecurrences = await Promise.all(
          recurrencesData.map((day) =>
            prisma.recurrence.create({
              data: {
                id: uuid(),
                eventId: updatedEvent.id,
                day: day.day,
              },
            }),
          ),
        );

        return { updatedEvent, updatedRecurrences };
      }

      return { updatedEvent, updatedRecurrences: [] };
    });

    return EventMapper.toDomain(result.updatedEvent, result.updatedRecurrences);
  }

  async delete(id: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { recurrences: true },
    });

    if (!event.once) {
      await this.prisma.recurrence.deleteMany({
        where: { eventId: id },
      });
    }

    await this.prisma.event.delete({
      where: { id },
    });
  }
}
