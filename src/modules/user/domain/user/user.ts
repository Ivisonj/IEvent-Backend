import { Entity } from 'src/shared/application/domain/Entity';

interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    const user = new User({ ...props }, id);
    return user;
  }
}
