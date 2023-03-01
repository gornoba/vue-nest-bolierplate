import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// typeorm 마이그레이션을 위한 datasource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host:
    process.env.ENVIRONMENT === 'production'
      ? process.env.PROD_DB_HOST
      : process.env.DEV_DB_HOST,
  port: 5432,
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  schema: process.env.DEV_DB_SCHEMA,
  synchronize: false,
  logging: true,
  entities: ['src/*/*.entity.ts'], // 엔티티 파일이 있는 경로
  migrations: ['migrations/*.ts'], // 마이그레이션 파일이 저장되는 경로
  migrationsTableName: 'migrations', // 마이그레이션 결과가 저장되는 테이블(없을 시 생성)
  subscribers: [],
});
