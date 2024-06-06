import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/infra/database/prisma/prisma-service.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new NotFoundException('Usuário não encontrotado');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id, email: user.email };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
