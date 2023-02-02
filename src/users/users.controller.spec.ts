import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const usersServiceMock = {
    create: jest.fn(
      () => (body: CreateUserDto) => Promise.resolve({ id: 1, ...body }),
    ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should call usersService.create with correct parameters', () => {
      const newUser = { name: 'Test', email: 'test@email.com' };
      usersController.createUser(newUser);
      expect(usersService.create).toHaveBeenCalledWith(newUser);
    });
  });
});
