import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace AttendanceErrors {
  export class FailSolicitation extends UseCaseError {
    constructor() {
      super('Fail solicitation');
    }
  }

  export class UserOrEventDoesNotMatch extends UseCaseError {
    constructor() {
      super('User or event does not match');
    }
  }

  export class EventLogNotFound extends UseCaseError {
    constructor() {
      super('Event log not found');
    }
  }

  export class PresenceAlreadyConfirmed extends UseCaseError {
    constructor() {
      super('Presence already confirmed');
    }
  }

  export class FailUpdateParticipantAttendance extends UseCaseError {
    constructor() {
      super('Fail to update participant attendance');
    }
  }
}
