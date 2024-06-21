import { Injectable } from '@nestjs/common';
import { Participant } from '../../domain/participant';
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

  async userExists(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });

    return !!result ? UserMapper.toDomain(result) : null;
  }

  async create(participant: Participant): Promise<Participant> {
    const data = ParticipantMapper.toPersistence(participant);
    const result = await this.prisma.participant.create({
      data,
    });

    return !!result ? ParticipantMapper.toDomain(result) : null;
  }
}
