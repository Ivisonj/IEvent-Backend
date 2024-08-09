import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventNotificationsErrors {
  export class EventNotFound extends UseCaseError {
    constructor() {
      super('Event not found');
    }
  }

  export class UserAndEventNotMatch extends UseCaseError {
    constructor() {
      super('User and event not match');
    }
  }
}
