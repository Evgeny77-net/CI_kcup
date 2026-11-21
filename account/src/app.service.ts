import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  getHello(): string {
    return 'Account Service is running';
  }

  async createAccount(
    email: string,
    name: string,
    balance = 100,
  ): Promise<Account> {
    const account = this.accountRepo.create({ email, name, balance });
    return this.accountRepo.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepo.find();
  }
}
