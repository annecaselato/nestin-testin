import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity';
import { useContainer } from 'class-validator';

describe('Users E2E', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite' as any,
          database: ':memory:',
          entities: [User],
          logging: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get<Repository<User>>('UserRepository');

    useContainer(app.select(UsersModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`/POST users`, () => {
    it('should return 201 if all parameters are valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test User', email: 'test.user@email.com' });

      expect(response.status).toEqual(201);
      await userRepository.query('DELETE FROM user');
    });

    it('should return 400 if name is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ name: '', email: 'test.user@email.com' });

      expect(response.status).toEqual(400);
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test User', email: 'test.user@email' });

      expect(response.status).toEqual(400);
    });

    it('should return 400 if user already exist', async () => {
      await userRepository.insert({
        name: 'User One',
        email: 'user.one@email.com',
      });

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test User', email: 'user.one@email.com' });

      expect(response.status).toEqual(400);
      await userRepository.query('DELETE FROM user');
    });
  });
});
