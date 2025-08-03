/*
Etapas de um teste:
> AAA:
 - ARRANGE:
    É o momento que você prepara tudo que o teste precisa: cria variáveis, mocks, instâncias, valores esperados, etc.
 - ACT:
    Você executa a ação a ser testada. Normalmente é uma função ou método que está sendo testado
 - ASSERT:
    É onde você valida se o resultado é o esperado. Usa métodos como expect(...), toBe(...), toEqual(...), etc.
*/

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from 'src/auth/hash/bcrypt.service';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { userSelectFields } from './constants/user-select-fields.constant';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import {
  createMockUserFactory,
  createUserDtoFactory,
} from 'test/factories/user.factory';
import { expectValidDto } from 'test/factories/utils/expect-valid-dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService & {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const prismaMock = {
      user: {
        findUnique: jest.fn() as jest.MockedFunction<
          typeof prismaService.user.findUnique
        >,
        create: jest.fn() as jest.MockedFunction<
          typeof prismaService.user.create
        >,
      },
    };

    const bcryptMock = {
      hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: BcryptService, useValue: bcryptMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create()', () => {
    it('should create a user', async () => {
      // ARRANGE
      const userData = createUserDtoFactory();
      const mockUser = createMockUserFactory();

      prismaService.user.findUnique.mockResolvedValueOnce(null);
      prismaService.user.create.mockResolvedValueOnce(mockUser);

      // ACT
      const result = await usersService.create(userData);

      // ASSERT
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: 'hashedPassword',
        },
        select: userSelectFields,
      });

      expect(result).toHaveProperty('email', userData.email);
      expect(result).toHaveProperty('name', userData.name);
      expect(result).not.toHaveProperty('password');
      expectValidDto(UserResponseDto, result);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const userData = createUserDtoFactory();

      prismaService.user.findUnique.mockResolvedValueOnce(
        createMockUserFactory({ id: 2, email: userData.email }),
      );

      await expect(usersService.create(userData)).rejects.toThrow(
        BadRequestException,
      );

      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw if prisma.create throws an error', async () => {
      const userData = createUserDtoFactory();

      prismaService.user.create.mockRejectedValueOnce(new Error('DB error'));

      await expect(usersService.create(userData)).rejects.toThrow('DB error');
    });
  });

  describe('findOne()', () => {
    it('should retrieve the user by ID', async () => {
      const userPayload: UserPayload = {
        sub: 1,
        email: 'joao.silva@exemplo.com',
        role: 'USER',
      };

      const mockUser = createMockUserFactory();

      prismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await usersService.findOne(userPayload);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userPayload.sub, isActive: true },
        select: userSelectFields,
      });

      expect(result).toEqual(mockUser);
      expectValidDto(UserResponseDto, result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userPayload: UserPayload = {
        sub: 999,
        email: 'nonexists@exemplo.com',
        role: 'USER',
      };

      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(usersService.findOne(userPayload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if prisma throws error', async () => {
      const userPayload: UserPayload = {
        sub: 1,
        email: 'joao.silva@exemplo.com',
        role: 'USER',
      };

      prismaService.user.findUnique.mockRejectedValueOnce(
        new Error('DB error'),
      );

      await expect(usersService.findOne(userPayload)).rejects.toThrow(
        'DB error',
      );
    });
  });
});
