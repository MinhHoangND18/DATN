import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['src/base/migrations/*.ts'],
  entities: ['dist/**/*.entity{.ts,.js}'],
};
