import { Entity } from 'src/shared/application/domain/Entity';

export enum ParticpantStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}

interface ParticipantProps {
  userId: string;
  eventId: string;
  status: ParticpantStatus;
}

export class Participant extends Entity<ParticipantProps> {
  get userId(): string {
    return this.props.userId;
  }
  get eventId(): string {
    return this.props.eventId;
  }
  get status(): ParticpantStatus {
    return this.props.status;
  }

  private constructor(props: ParticipantProps, id?: string) {
    super(props, id);
  }

  public static create(props: ParticipantProps, id?: string): Participant {
    const participant = new Participant({ ...props }, id);
    return participant;
  }
}
