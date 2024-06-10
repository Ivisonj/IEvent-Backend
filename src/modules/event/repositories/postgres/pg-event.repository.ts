import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/event';
import { EventMapper } from '../../mappers/event.map';
import { IEventRepository } from '../event-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';

@Injectable()
export class PgEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: Event): Promise<Event> {
    const data = await EventMapper.toPersistence(event);
    const result = await this.prisma.event.create({
      data,
    });
    return !!result ? EventMapper.toDomain(result) : null;
  }
}
