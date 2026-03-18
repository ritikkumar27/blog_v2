import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: 'postgres://blog_user:blog_password@localhost:5432/blog_db',
});

export const db = drizzle(pool, { schema });
