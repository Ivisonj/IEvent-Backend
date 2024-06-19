interface IUseCaseSuccess {
  message: string;
}

export abstract class UseCaseSuccess implements IUseCaseSuccess {
  public readonly message: string;
  constructor(message: string) {
    this.message = message;
  }
}
