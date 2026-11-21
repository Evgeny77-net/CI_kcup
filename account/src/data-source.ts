import { DataSource } from 'typeorm';
import { Account } from './account.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://ci_user:ci_password@localhost:5432/microservices_ci',
  entities: [Account],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
