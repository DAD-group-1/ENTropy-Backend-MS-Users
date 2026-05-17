import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // Load variables from your .env file

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST_CLI || 'localhost',
  port: parseInt(process.env.DB_PORT_CLI || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_NAME || 'entropy_users_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
