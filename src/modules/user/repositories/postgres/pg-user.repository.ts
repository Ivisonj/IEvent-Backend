import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user/user';
import { UserMapper } from '../../mappers/user.map';
import { IUserRepository } from '../user-repository.interface';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';

@Injectable()
export class PgUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(email: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return result !== null ? UserMapper.toDomain(result) : null;
  }

  async create(user: User): Promise<User> {
    const data = await UserMapper.toPersistence(user);
    const result = await this.prisma.user.create({
      data,
    });
    return !!result ? UserMapper.toDomain(result) : null;
  }
}
