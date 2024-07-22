import { Entity } from 'src/shared/application/domain/Entity';

interface EventLogProps {
  eventId: string;
  date: string | Date;
  start_time: string | Date;
  end_time?: string | Date;
}

export class EventLog extends Entity<EventLogProps> {
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

  constructor(props: EventLogProps, id?: string) {
    super(props, id);
  }

  public static create(props: EventLogProps, id?: string): EventLog {
    const eventLog = new EventLog({ ...props }, id);
    return eventLog;
  }
}
