import { UserAccount } from '../domain/user-account';

export abstract class IUserAccountRepository {
  abstract exists(email: string): Promise<boolean>;
  abstract create(userAccount: UserAccount): Promise<UserAccount | null>;
}
