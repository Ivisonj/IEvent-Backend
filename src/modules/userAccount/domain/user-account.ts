import { Entity } from 'src/shared/application/domain/Entity';

interface UserAccountProps {
  name: string;
  email: string;
  password: string;
}

export class UserAccount extends Entity<UserAccountProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }

  private constructor(props: UserAccountProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserAccountProps, id?: string): UserAccount {
    const userAccount = new UserAccount({ ...props }, id);
    return userAccount;
  }
}
