import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity';

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

    await app.init();
  });

  describe(`/POST users`, () => {
    it('should return 201 if all parameters are valid', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Test User', email: 'test.user@email.com' })
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await userRepository.query('DROP TABLE user');
  });
});
