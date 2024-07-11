import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace RegisterEventErrors {
  export class EventNotExists extends UseCaseError {
    constructor() {
      super('Event not exists');
    }
  }

  export class EventCanNotStart extends UseCaseError {
    constructor() {
      super('Event can not Start');
    }
  }
}
