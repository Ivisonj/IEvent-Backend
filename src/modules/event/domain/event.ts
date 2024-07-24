import { Entity } from 'src/shared/application/domain/Entity';

interface EventProps {
  userId: string;
  name: string;
  description: string;
  address: string;
  isPublic: boolean;
  once: boolean;
  isActive: boolean;
  recurrence?: number[];
  custom_rules: boolean;
  tolerance_time?: number;
  absences_limit?: number;
  delays_limit?: number;
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

  get description(): string {
    return this.props.description;
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

  get isActive(): boolean {
    return this.props.isActive;
  }

  get recurrence(): number[] | undefined {
    return this.props.recurrence;
  }

  get custom_rules(): boolean {
    return this.props.custom_rules;
  }

  get tolerance_time(): number | undefined {
    return this.props.tolerance_time;
  }

  get absences_limit(): number | undefined {
    return this.props.absences_limit;
  }

  get delays_limit(): number | undefined {
    return this.props.delays_limit;
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
