export default interface CryptoProvider {
  encrypt(password: string): string;
  compare(password: string, encryptPassword: string): boolean;
}
