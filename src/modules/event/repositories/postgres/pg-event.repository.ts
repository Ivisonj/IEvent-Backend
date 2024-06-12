import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Event } from '../../domain/event';
import { EventMapper } from '../../mappers/event.map';
import { IEventRepository } from '../event-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';

@Injectable()
export class PgEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

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
              recurrence: day.recurrence,
            },
          }),
        ),
      );

      return { createdEvent, recurrences };
    });

    return EventMapper.toDomain(result.createdEvent, result.recurrences);
  }
}
