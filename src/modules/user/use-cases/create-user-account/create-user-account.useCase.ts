import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user/user';
import { IUserRepository } from '../../repositories/user-repository.interface';
import { CreateUserAccountErrors } from './create-user-account.errors';
import { Either, left, right } from 'src/shared/application/Either';
import { CreateUserAccountDTO } from './create-user-account.DTO';
import { UserMapper } from '../../mappers/user.map';
import { UserDTO } from '../../dtos/user.DTO';
import CryptoProvider from 'src/shared/application/domain/cryptoProvider';

export const CRYPTO_PROVIDER = 'CRYPTO_PROVIDER';

export type CreateUserAccountResponse = Either<
  CreateUserAccountErrors.UserAccountAlreadyExistsError | Error,
  UserDTO
>;

@Injectable()
export class CreateUserAccountUseCase {
  constructor(
    private readonly userAccountRepository: IUserRepository,
    @Inject(CRYPTO_PROVIDER) private readonly cryptoProvider: CryptoProvider,
  ) {}

  public async execute(
    request: CreateUserAccountDTO,
  ): Promise<CreateUserAccountResponse> {
    const accountExists = await this.userAccountRepository.exists(
      request.email,
    );

    const encryptPassword = this.cryptoProvider.encrypt(request.password);

    if (accountExists)
      return left(new CreateUserAccountErrors.UserAccountAlreadyExistsError());

    const userAccountOrError = User.create({
      name: request.name,
      email: request.email,
      password: encryptPassword,
    });

    const account = await this.userAccountRepository.create(userAccountOrError);
    const dto = UserMapper.toDTO(account);
    return right(dto);
  }
}
