import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventsByDateErrors {
  export class InvalidDate extends UseCaseError {
    constructor() {
      super('Invalid date');
    }
  }
}
