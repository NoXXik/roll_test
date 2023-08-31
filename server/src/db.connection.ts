import { TypeOrmModule } from "@nestjs/typeorm";
import {config} from 'dotenv';
import {join} from 'path'

config()
const CONNECTION = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrationsTableName: "migrations",
} as TypeOrmModule

export default CONNECTION;
