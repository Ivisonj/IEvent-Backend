import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace CreateEventErrors {
  export class userExists extends UseCaseError {
    constructor() {
      super('User not exists');
    }
  }

  export class InvalidDate extends UseCaseError {
    constructor() {
      super('Invalid date');
    }
  }
}
