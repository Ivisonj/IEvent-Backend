import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace ResponseSolicitationErrors {
  export class SolicitationNotFound extends UseCaseError {
    constructor() {
      super('Solicitation not found');
    }
  }

  export class FailToUpdateStatus extends UseCaseError {
    constructor() {
      super('Fail to update status');
    }
  }

  export class YouNotHavePermissionToAcceptThisSolicitation extends UseCaseError {
    constructor() {
      super('You do not have permission to accept this solicitation');
    }
  }
}
