import { User as UserPrisma } from '@prisma/client';
import { User } from '../domain/user/user';
import { UserDTO } from '../dtos/user.DTO';

export class UserMapper {
  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.props.name,
      email: user.props.email,
      password: user.props.password,
    };
  }

  static toDomain(raw: UserPrisma): User {
    const userOrError = User.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
    });
    return userOrError;
  }

  public static async toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
