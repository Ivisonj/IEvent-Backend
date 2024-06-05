import { UseCaseError } from 'src/shared/application/use-case.error';

export namespace CreateUserAccountErrors {
  export class UserAccountAlreadyExistsError extends UseCaseError {
    constructor() {
      super('Usuário já existe.');
    }
  }
}
