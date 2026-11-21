import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthUser } from './auth-user.entity';

describe('Auth AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((dto) => dto),
      save: jest.fn((user) => Promise.resolve({ id: 'auth-uuid-1', ...user })),
    };

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'acc-uuid-1' }),
    }) as jest.Mock;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getRepositoryToken(AuthUser), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should register user and return JWT token', async () => {
    const result = await appController.register({
      email: 'student@example.com',
      password: 'StrongPassword123',
      name: 'Student',
    });

    expect(result.email).toBe('student@example.com');
    expect(result.accessToken).toBe('mocked.jwt.token');
  });
});
