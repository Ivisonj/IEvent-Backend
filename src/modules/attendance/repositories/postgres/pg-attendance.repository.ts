import { Injectable } from '@nestjs/common';
import { Attendance, AttendanceStatus } from '../../domain/attendance';
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

  async participantData(
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

  async eventLogExists(eventLogId: string): Promise<EventLog | null> {
    const register = await this.prisma.event_Log.findUnique({
      where: { id: eventLogId, AND: { end_time: null } },
    });
    return !!register ? EventLogMapper.toDomain(register) : null;
  }

  async findEvent(eventId: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });
    return !!event ? EventMapper.toDomain(event, event.recurrence) : null;
  }

  async eventStartTime(eventLogId: string): Promise<Date | null> {
    const result = await this.prisma.event_Log.findUnique({
      where: { id: eventLogId },
      select: { start_time: true },
    });
    return !!result ? result.start_time : null;
  }

  async attendanceRecordExists(
    eventLogId: string,
    userId: string,
  ): Promise<Attendance | null> {
    const result = await this.prisma.attendance.findFirst({
      where: { eventLogId: eventLogId, userId: userId },
    });

    return !!result ? AttendanceMapper.toDomain(result) : null;
  }

  async updateParticipantAttendance(
    eventId: string,
    userId: string,
    status: string,
  ): Promise<Participant | null> {
    if (status === AttendanceStatus.presence) {
      const participantId = await this.prisma.participant.findFirst({
        where: { eventId: eventId, userId: userId },
        select: { id: true },
      });

      const updateParticipant = await this.prisma.participant.update({
        where: { id: participantId.id },
        data: { presenceCount: { increment: 1 } },
      });

      return !!updateParticipant
        ? ParticipantMapper.toDomain(updateParticipant)
        : null;
    } else if (status === AttendanceStatus.late) {
      const participant = await this.prisma.participant.findFirst({
        where: { eventId: eventId, userId: userId },
      });

      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { recurrence: true },
      });

      if (participant.lateCount >= event.delays_limit) {
        const updateParticipant = await this.prisma.participant.update({
          where: { id: participant.id },
          data: { lateCount: 1 },
        });

        return !!updateParticipant
          ? ParticipantMapper.toDomain(updateParticipant)
          : null;
      } else {
        const updateParticipant = await this.prisma.participant.update({
          where: { id: participant.id },
          data: { lateCount: { increment: 1 } },
        });

        return !!updateParticipant
          ? ParticipantMapper.toDomain(updateParticipant)
          : null;
      }
    }
  }
}
