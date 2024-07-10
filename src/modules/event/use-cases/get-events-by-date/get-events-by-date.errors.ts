import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventsByDateErrors {
  export class UserNotExists extends UseCaseError {
    constructor() {
      super('User not exists');
    }
  }
}
