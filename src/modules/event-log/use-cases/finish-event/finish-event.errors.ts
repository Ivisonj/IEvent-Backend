import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace FinishEventErrors {
  export class FailToFinishEvent extends UseCaseError {
    constructor() {
      super('Fail to finish event');
    }
  }
}
