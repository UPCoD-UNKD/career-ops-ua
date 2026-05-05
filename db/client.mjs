import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const cleanDbUrl = (process.env.DATABASE_URL || '')
  .replace('&channel_binding=require', '')
  .replace('?channel_binding=require&', '?')
  .replace('?channel_binding=require', '');

const sql = postgres(cleanDbUrl, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
});

export default sql;
