import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidationMessages } from 'src/common/messages/validation-messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { BcryptService } from './hash/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async authenticate(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user)
      throw new UnauthorizedException(ValidationMessages.AUTH_INVALID_EMAIL);

    const isValidPassword = await this.bcrypt.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isValidPassword)
      throw new UnauthorizedException(ValidationMessages.AUTH_INVALID_PASSWORD);

    // Aqui você pode gerar e retornar o token JWT
    return {
      access_token: 'fake-token', // substitua pela geração real de token
    };
  }
}
