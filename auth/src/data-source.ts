import { DataSource } from 'typeorm';
import { AuthUser } from './auth-user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://ci_user:ci_password@localhost:5432/microservices_ci',
  entities: [AuthUser],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
