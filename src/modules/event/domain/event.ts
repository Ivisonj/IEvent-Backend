import { Entity } from 'src/shared/application/domain/Entity';

interface EventProps {
  userId: string;
  name: string;
  address: string;
  isPublic: boolean;
  once: boolean;
  recurrence?: string[];
  custom_rules: boolean;
  absences_limit?: boolean;
  max_absences?: number;
  delays_limit?: boolean;
  max_delays?: number;
  start_date: string | Date;
  end_date: string | Date;
  start_time: string | Date;
  end_time: string | Date;
}

export class Event extends Entity<EventProps> {
  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string {
    return this.props.address;
  }

  get isPublic(): boolean {
    return this.props.isPublic;
  }

  get once(): boolean {
    return this.props.once;
  }

  get recurrence(): string[] | undefined {
    return this.props.recurrence;
  }

  get custom_rules(): boolean {
    return this.props.custom_rules;
  }

  get absences_limit(): boolean | undefined {
    return this.props.absences_limit;
  }

  get max_absences(): number | undefined {
    return this.props.max_absences;
  }

  get delays_limit(): boolean | undefined {
    return this.props.delays_limit;
  }

  get max_delays(): number | undefined {
    return this.props.max_delays;
  }

  get start_date(): string | Date {
    return this.props.start_date;
  }

  get end_date(): string | Date {
    return this.props.end_date;
  }

  get start_time(): string | Date {
    return this.props.start_time;
  }

  get end_time(): string | Date {
    return this.props.end_time;
  }

  private constructor(props: EventProps, id?: string) {
    super(props, id);
  }

  public static create(props: EventProps, id?: string): Event {
    const event = new Event({ ...props }, id);
    return event;
  }
}
