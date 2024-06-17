import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace UpdateEventErrors {
  export class EventNotExists extends UseCaseError {
    constructor() {
      super('Evento não encontrado');
    }
  }

  export class FailUpdateEvent extends UseCaseError {
    constructor() {
      super('Falha ao atualizar evento');
    }
  }
}
