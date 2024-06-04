import { User as UserAccountPrisma } from '@prisma/client';

import { UserAccount } from '../domain/user-account';
import { UserAccountDTO } from '../dtos/user-account.DTO';

export class UserAccountMapper {
  public static toDTO(userAccount: UserAccount): UserAccountDTO {
    return {
      id: userAccount.id,
      ...userAccount.props,
    };
  }

  static toDomain(raw: UserAccountPrisma): UserAccountDTO {
    const userAccountOrError = UserAccount.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
    });
    return userAccountOrError;
  }

  static toPersistence(userAccount: UserAccount) {
    return {
      id: userAccount.id,
      name: userAccount.name,
      email: userAccount.email,
      possword: userAccount.password,
    };
  }
}
