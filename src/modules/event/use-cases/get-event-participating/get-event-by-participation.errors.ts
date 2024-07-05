import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventByParticipationErrors {
  export class UserNotExists extends UseCaseError {
    constructor() {
      super('User not exists');
    }
  }
}
