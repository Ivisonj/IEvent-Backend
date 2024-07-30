import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetParticipantsErrors {
  export class UserOrEventNotMatch extends UseCaseError {
    constructor() {
      super('User or event not match');
    }
  }
}
