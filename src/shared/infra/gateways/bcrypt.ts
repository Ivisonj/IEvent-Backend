import * as bcrypt from 'bcrypt';
import CryptoProvider from 'src/shared/application/domain/cryptoProvider';

export default class PasswordCrypto implements CryptoProvider {
  encrypt(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  compare(password: string, encryptPassword: string): boolean {
    return bcrypt.compareSync(password, encryptPassword);
  }
}
