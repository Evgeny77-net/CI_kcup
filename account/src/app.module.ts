import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Account } from './account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://ci_user:ci_password@localhost:5432/microservices_ci',
      entities: [Account],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
