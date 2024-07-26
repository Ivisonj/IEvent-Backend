import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventParticipantsErrors {
  export class UserOrEventNotMatch extends UseCaseError {
    constructor() {
      super('User or event not match');
    }
  }
}
