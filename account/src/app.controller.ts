import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './account.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('accounts')
  create(@Body() body: { email: string; name: string; balance?: number }): Promise<Account> {
    return this.appService.createAccount(body.email, body.name, body.balance);
  }

  @Get('accounts')
  findAll(): Promise<Account[]> {
    return this.appService.findAll();
  }
}
