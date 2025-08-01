import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ValidationMessages } from 'src/common/messages/validation-messages';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtConfig from './config/jwt.config';
import { SignInDto } from './dto/signin.dto';
import { BcryptService } from './hash/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
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

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      // Estas configurações não precisam ser passadas pois no JwtModule já foram definidas, a menos que queira sobreescrever
      // {
      //   secret: this.jwtConfiguration.secret,
      //   expiresIn: this.jwtConfiguration.jwtTtl,
      //   audience: this.jwtConfiguration.audience,
      //   issuer: this.jwtConfiguration.issuer,
      // },
    );

    // Aqui você pode gerar e retornar o token JWT
    return {
      access_token: token, // substitua pela geração real de token
    };
  }
}
