import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Account } from './account.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((user) => Promise.resolve({ id: 'uuid-1', ...user })),
      find: jest.fn(() => Promise.resolve([])),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getRepositoryToken(Account), useValue: mockRepo },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should create a user account', async () => {
    const user = await appController.create({
      email: 'ivan@example.com',
      name: 'Ivan',
    });
    expect(user.email).toBe('ivan@example.com');
  });
});
