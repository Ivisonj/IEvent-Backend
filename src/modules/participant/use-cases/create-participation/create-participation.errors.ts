import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace CreateParticipantErrors {
  export class UserNotExists extends UseCaseError {
    constructor() {
      super('Usuário não encontrado');
    }
  }

  export class EventNotExists extends UseCaseError {
    constructor() {
      super('Evento não encontrado');
    }
  }
}
