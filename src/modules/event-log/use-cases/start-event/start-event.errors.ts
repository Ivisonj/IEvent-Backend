import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace StartEventErrors {
  export class EventNotExists extends UseCaseError {
    constructor() {
      super('Event not exists');
    }
  }

  export class FailToStartEvent extends UseCaseError {
    constructor() {
      super('Fail to start event');
    }
  }

  export class EventCanNotStartToday extends UseCaseError {
    constructor() {
      super('Event can not start today');
    }
  }

  export class FailSolicitation extends UseCaseError {
    constructor() {
      super('Fail solicitation');
    }
  }
}
