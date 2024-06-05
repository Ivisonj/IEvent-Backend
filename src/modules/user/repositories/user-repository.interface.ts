import { User } from '../domain/user/user';

export abstract class IUserRepository {
  abstract exists(email: string): Promise<User | null>;
  abstract create(user: User): Promise<User | null>;
}
