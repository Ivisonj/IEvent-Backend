import { Entity } from 'src/shared/application/domain/Entity';

export enum AttendanceStatus {
  presence = 'presence',
  late = 'late',
  absence = 'absence',
}

interface AttendanceProps {
  userId: string;
  eventId: string;
  eventLogId: string;
  checkedInAt: string | Date;
  status: AttendanceStatus;
}

export class Attendance extends Entity<AttendanceProps> {
  get userId(): string {
    return this.props.userId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get eventLogId(): string {
    return this.props.eventLogId;
  }

  get checkedInAt(): string | Date {
    return this.props.checkedInAt;
  }

  get status(): AttendanceStatus {
    return this.props.status;
  }

  constructor(props: AttendanceProps, id?: string) {
    super(props, id);
  }

  public static create(props: AttendanceProps, id?: string): Attendance {
    const attendance = new Attendance({ ...props }, id);
    return attendance;
  }
}
