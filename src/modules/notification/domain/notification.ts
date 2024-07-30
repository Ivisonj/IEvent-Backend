import { Entity } from 'src/shared/application/domain/Entity';

export enum NotificationTypes {
  solicitation = 'solicitation',
  alert = 'alert',
}

interface NotificationProps {
  userId: string;
  eventId: string;
  message?: string;
  type: NotificationTypes;
  createdAt: string | Date;
  readed: boolean;
}

export class Notification extends Entity<NotificationProps> {
  get userId(): string {
    return this.props.userId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get message(): string | undefined {
    return this.props.message;
  }

  get type(): NotificationTypes {
    return this.props.type;
  }

  get createdAt(): string | Date {
    return this.props.createdAt;
  }

  get readed(): boolean {
    return this.props.readed;
  }

  constructor(props: NotificationProps, id?: string) {
    super(props, id);
  }

  public static create(props: NotificationProps, id?: string): Notification {
    const notification = new Notification({ ...props }, id);
    return notification;
  }
}
