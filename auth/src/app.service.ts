import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthUser } from './auth-user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authRepo: Repository<AuthUser>,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Auth Service is running';
  }

  async register(email: string, password: string, name: string) {
    const existing = await this.authRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.authRepo.create({ email, passwordHash });
    const savedUser = await this.authRepo.save(user);

    // Создаем профиль и начальный баланс в сервисе account
    const accountUrl = process.env.ACCOUNT_SERVICE_URL || 'http://account:3001';
    await fetch(`${accountUrl}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, balance: 100 }),
    });

    const accessToken = await this.jwtService.signAsync({
      sub: savedUser.id,
      email: savedUser.email,
    });

    return {
      userId: savedUser.id,
      email: savedUser.email,
      accessToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.authRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
