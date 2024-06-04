export interface JwtCryptography {
  generateToken: ({
    key,
    expiresIn,
  }: TokenGenerator.Params) => TokenGenerator.Result;
  validateToken: (token: string) => any;
  decodeToken: (token: string) => any;
}
export namespace TokenGenerator {
  export type Params = {
    key: any;
    expiresIn: number | string;
  };
  export type Result = string | undefined;
}
