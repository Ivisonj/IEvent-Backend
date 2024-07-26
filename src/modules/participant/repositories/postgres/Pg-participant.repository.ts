import { Injectable } from '@nestjs/common';
import { Participant, ParticpantStatus } from '../../domain/participant';
import { ParticipantMapper } from '../../mappers/participant.map';
import { IParticipantRepository } from '../participant-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { User } from 'src/modules/user/domain/user/user';
import { UserMapper } from 'src/modules/user/mappers/user.map';
import { EventMapper } from 'src/modules/event/mappers/event.map';
import { Event } from 'src/modules/event/domain/Event';

@Injectable()
export class PgParticipantRepository implements IParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<Participant | null> {
    const result = await this.prisma.participant.findUnique({
      where: { id },
    });
    return !!result ? ParticipantMapper.toDomain(result) : null;
  }

  async userExists(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });

    return !!result ? UserMapper.toDomain(result) : null;
  }

  async eventExists(id: string): Promise<Event> {
    const result = await this.prisma.event.findUnique({
      where: { id },
      include: { recurrence: true },
    });

    return !!result ? EventMapper.toDomain(result, result.recurrence) : null;
  }

  async solicitationExists(
    userId: string,
    eventId: string,
  ): Promise<Participant> {
    const result = await this.prisma.participant.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    return !!result ? ParticipantMapper.toDomain(result) : null;
  }

  async create(participant: Participant): Promise<Participant> {
    const data = ParticipantMapper.toPersistence(participant);
    const result = await this.prisma.participant.create({
      data,
    });

    return !!result ? ParticipantMapper.toDomain(result) : null;
  }

  async updateStatus(
    id: string,
    updatedStatus: ParticpantStatus,
  ): Promise<Participant | null> {
    if (updatedStatus === ParticpantStatus.rejected) {
      await this.prisma.participant.delete({
        where: { id },
      });
      return null;
    } else {
      const result = await this.prisma.participant.update({
        where: { id },
        data: { status: updatedStatus },
      });

      return !!result ? ParticipantMapper.toDomain(result) : null;
    }
  }

  async findParticipants(
    eventId: string,
    userId: string,
  ): Promise<Participant | null> {
    const participant = await this.prisma.participant.findFirst({
      where: {
        eventId: eventId,
        userId: userId,
        AND: { status: ParticpantStatus.accepted },
      },
    });
    return !!participant ? ParticipantMapper.toDomain(participant) : null;
  }
}
