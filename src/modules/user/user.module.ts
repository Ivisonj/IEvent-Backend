import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';
import { CreateUserController } from './use-cases/create-user-account/create-user-account.controller';
import { IUserRepository } from './repositories/user-repository.interface';
import { PgUserRepository } from './repositories/postgres/pg-user.repository';
import { CreateUserAccountUseCase } from './use-cases/create-user-account/create-user-account.useCase';
import { CRYPTO_PROVIDER } from './use-cases/create-user-account/create-user-account.useCase';
import PasswordCrypto from 'src/shared/infra/gateways/bcrypt';

@Module({
  controllers: [CreateUserController],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PgUserRepository,
    },
    {
      provide: CRYPTO_PROVIDER,
      useClass: PasswordCrypto,
    },
    CreateUserAccountUseCase,
  ],
  exports: [IUserRepository],
})
export class UserModule {}
