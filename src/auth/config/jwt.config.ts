import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  jwtTtl: process.env.JWT_TTL,
  issuer: process.env.JWT_TOKEN_ISSUER,
  audience: process.env.JWT_TOKEN_AUDIENCE,
}));
