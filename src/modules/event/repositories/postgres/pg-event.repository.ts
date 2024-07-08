import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Event } from '../../domain/Event';
import { EventMapper } from '../../mappers/event.map';
import { IEventRepository } from '../event-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { User } from 'src/modules/user/domain/user/user';
import { UserMapper } from 'src/modules/user/mappers/user.map';
import { ParticpantStatus } from 'src/modules/participant/domain/participant';

@Injectable()
export class PgEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { recurrence: true },
    });
    return event ? EventMapper.toDomain(event, event.recurrence) : null;
  }

  async userExists(id: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });

    return !!result ? UserMapper.toDomain(result) : null;
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
      include: { recurrence: true },
    });

    return events.map((event) => EventMapper.toDomain(event, event.recurrence));
  }

  async findById(id: string): Promise<Event[]> {
    const event = await this.prisma.event.findMany({
      where: { id },
      include: { recurrence: true },
    });

    if (!event) return null;

    return event.map((event) => EventMapper.toDomain(event, event.recurrence));
  }

  async findByName(name: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        name: {
          startsWith: name,
          mode: 'insensitive',
        },
      },
      include: { recurrence: true },
    });

    return events.map((event) => EventMapper.toDomain(event, event.recurrence));
  }

  async findByParticipation(userId: string): Promise<Event[] | null> {
    const participants = await this.prisma.participant.findMany({
      where: {
        userId,
        status: ParticpantStatus.accepted,
      },
      include: {
        event: {
          include: {
            recurrence: true,
          },
        },
      },
    });

    const events = participants.map((participant) => participant.event);

    return events.map((event) => EventMapper.toDomain(event, event.recurrence));
  }

  async findByDate(date: string): Promise<Event[] | null> {
    const dateReceived = new Date(date);
    const dayOfWeek = dateReceived.getDay();
    const events = await this.prisma.event.findMany({
      where: {
        AND: [
          {
            start_date: {
              lte: dateReceived,
            },
          },
          {
            end_date: {
              gte: dateReceived,
            },
          },
        ],
      },
      include: {
        recurrence: true,
      },
    });

    const recurringEvents = await this.prisma.event.findMany({
      where: {
        recurrence: {
          some: {
            day: dayOfWeek,
          },
        },
      },
      include: { recurrence: true },
    });

    const allEvents = [...events, ...recurringEvents];

    return allEvents.map((event) =>
      EventMapper.toDomain(event, event.recurrence),
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
      include: { recurrence: true },
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
