import { Injectable } from '@nestjs/common';
import { Attendance } from '../../domain/attendance';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { IAttendanceRepository } from '../attendance-repository.interface';
import { AttendanceMapper } from '../../mappers/attendance.map';
import {
  Participant,
  ParticpantStatus,
} from 'src/modules/participant/domain/participant';
import { ParticipantMapper } from 'src/modules/participant/mappers/participant.map';
import { EventLogMapper } from 'src/modules/event-log/mappers/eventLog.map';
import { EventLog } from 'src/modules/event-log/domain/event-log';
import { Event } from 'src/modules/event/domain/Event';
import { EventMapper } from 'src/modules/event/mappers/event.map';

@Injectable()
export class PgAttendanceRepository implements IAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attendance: Attendance): Promise<Attendance | null> {
    const data = await AttendanceMapper.toPersistence(attendance);
    const result = await this.prisma.attendance.create({
      data,
    });

    return !!attendance ? AttendanceMapper.toDomain(result) : null;
  }

  async isParticipant(
    userId: string,
    eventId: string,
  ): Promise<Participant | null> {
    const result = await this.prisma.participant.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
        status: ParticpantStatus.accepted,
      },
    });
    return !!result ? ParticipantMapper.toDomain(result) : null;
  }

  async registerExists(registerId: string): Promise<EventLog | null> {
    const register = await this.prisma.register_Events.findUnique({
      where: { id: registerId, AND: { end_time: null } },
    });
    return !!register ? EventLogMapper.toDomain(register) : null;
  }

  async getEvent(eventId: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });
    return !!event ? EventMapper.toDomain(event, event.recurrence) : null;
  }

  async eventStartTime(registerId: string): Promise<Date | null> {
    const result = await this.prisma.register_Events.findUnique({
      where: { id: registerId },
      select: { start_time: true },
    });
    return !!result ? result.start_time : null;
  }
}