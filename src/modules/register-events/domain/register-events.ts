import { Entity } from 'src/shared/application/domain/Entity';

interface RegisterEventsProps {
  eventId: string;
  date: string | Date;
  start_time: string | Date;
  end_time?: string | Date;
}

export class RegisterEvents extends Entity<RegisterEventsProps> {
  get eventId(): string {
    return this.props.eventId;
  }

  get date(): string | Date {
    return this.props.date;
  }

  get start_time(): string | Date {
    return this.props.start_time;
  }

  get end_time(): string | Date {
    return this.props.end_time;
  }

  constructor(props: RegisterEventsProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: RegisterEventsProps,
    id?: string,
  ): RegisterEvents {
    const registerEvents = new RegisterEvents({ ...props }, id);
    return registerEvents;
  }
}
