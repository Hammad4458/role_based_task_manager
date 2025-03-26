import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();



export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*.js'],

  synchronize: false,
  logging: false,
});
