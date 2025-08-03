import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserPayload } from 'src/auth/types/user-payload.type';

export function createUserDtoFactory(
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto {
  return {
    name: 'João da Silva',
    email: 'joao.silva@exemplo.com',
    password: 'senhaSuperSecreta123',
    passwordConfirm: 'senhaSuperSecreta123',
    ...overrides,
  };
}

export function createUserPayloadFactory(
  overrides: Partial<UserPayload> = {},
): UserPayload {
  return {
    sub: 1,
    email: 'joao.silva@exemplo.com',
    role: 'USER',
    ...overrides,
  };
}

export function createMockUserFactory(overrides = {}) {
  return {
    id: 1,
    name: 'João da Silva',
    email: 'joao.silva@exemplo.com',
    avatarUrl: 'http://avatar.url',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
    ...overrides,
  };
}
