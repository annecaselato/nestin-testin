import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            insert: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('users service should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should call userRespository.insert with correct parameters', async () => {
      const newUser = { name: 'Test User', email: 'testuser@email.com' };
      await usersService.create(newUser);
      expect(userRepository.insert).toHaveBeenCalledWith(newUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should call userRespository.findOne with correct parameters', async () => {
      await usersService.findOneByEmail('test@email.com');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
    });
  });
});
