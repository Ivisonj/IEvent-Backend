import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetUserNotificationsErrors {
  export class UserNotFound extends UseCaseError {
    constructor() {
      super('User not found');
    }
  }
}
