import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return this.appService.register(body.email, body.password, body.name);
  }

  @Post('auth/login')
  login(@Body() body: { email: string; password: string }) {
    return this.appService.login(body.email, body.password);
  }
}
