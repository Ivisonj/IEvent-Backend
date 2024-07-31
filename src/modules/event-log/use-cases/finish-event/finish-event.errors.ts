import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace FinishEventErrors {
  export class EventLogNotFound extends UseCaseError {
    constructor() {
      super('Event log not found');
    }
  }

  export class FailToFinishEvent extends UseCaseError {
    constructor() {
      super('Fail to finish event');
    }
  }

  export class FailToStartEvent extends UseCaseError {
    constructor() {
      super('Fail to start event');
    }
  }

  export class EventAlreadyFinished extends UseCaseError {
    constructor() {
      super('Event already finished');
    }
  }
}
