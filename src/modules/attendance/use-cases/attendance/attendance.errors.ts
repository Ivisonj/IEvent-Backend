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

  export class RegisterEventNotFound extends UseCaseError {
    constructor() {
      super('register event not found');
    }
  }
}
