import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthUser } from './auth-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://ci_user:ci_password@localhost:5432/microservices_ci',
      entities: [AuthUser],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([AuthUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-ci-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
