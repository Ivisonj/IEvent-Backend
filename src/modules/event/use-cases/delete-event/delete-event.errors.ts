import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace DeleteEventError {
  export class EventNotExists extends UseCaseError {
    constructor() {
      super('Evento não encontrado');
    }
  }
}
