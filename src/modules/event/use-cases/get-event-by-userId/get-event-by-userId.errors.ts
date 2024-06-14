import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace GetEventsByUserIdErrors {
  export class EventNotExistsError extends UseCaseError {
    constructor() {
      super('O usuário não possui eventos');
    }
  }
}
