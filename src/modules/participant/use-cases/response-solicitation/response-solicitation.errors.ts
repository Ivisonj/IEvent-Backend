import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace ResponseSolicitationErrors {
  export class SolicitationNotExists extends UseCaseError {
    constructor() {
      super('Solicitação não encontrada');
    }
  }
}
