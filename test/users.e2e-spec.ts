import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { cleanDb } from './utils/prisma-test';
import { App } from 'supertest/types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { createUserDtoFactory } from './factories/user.factory';
import { BcryptService } from 'src/auth/hash/bcrypt.service';
import { ValidationMessages } from 'src/common/messages/validation-messages';
import { HttpExceptionFilter } from 'src/common/filters/http-error.filter';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let bcrypt: BcryptService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    prisma = app.get(PrismaService);
    bcrypt = app.get(BcryptService);
    await app.init();
  });

  beforeEach(async () => {
    await cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    const createUserDto: CreateUserDto = createUserDtoFactory();

    it('should create user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      const isMatch = await bcrypt.comparePassword(
        createUserDto.password,
        user!.password,
      );

      expect(user).toBeTruthy();
      expect(user!.name).toBe(createUserDto.name);
      expect(user!.email).toBe(createUserDto.email);
      expect(user!.password).not.toEqual(createUserDto.password);
      expect(isMatch).toBe(true);
      expect(user!.isActive).toBeTruthy();
      expect(user!.avatarUrl).toBeNull();
    });

    it('should return 400 if name is not a string', async () => {
      const invalidCreateUserDto = {
        ...createUserDto,
        name: 1, // valor inválido proposital
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidCreateUserDto)
        .expect(400);

      const user = await prisma.user.findUnique({
        where: { email: invalidCreateUserDto.email },
      });

      expect(user).toBeNull();
      expect(response.body['message'][0]).toEqual(
        ValidationMessages.FIELD_STRING('name'),
      );
    });

    it('should return 400 if name is empty', async () => {
      const invalidCreateUserDto = {
        ...createUserDtoFactory(),
        name: '', // string vazia, ativa o IsNotEmpty
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidCreateUserDto)
        .expect(400);

      const user = await prisma.user.findUnique({
        where: { email: invalidCreateUserDto.email },
      });

      expect(user).toBeNull();
      expect(response.body.message).toContain(
        ValidationMessages.FIELD_REQUIRED('name'),
      );
    });
  });
});
