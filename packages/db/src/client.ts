import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL environment variable is not set.\n\n' +
          'Did you run "bun setup"? This should:\n' +
          '1. Create your .env file\n' +
          '2. Start Supabase\n' +
          '3. Copy credentials to .env\n\n' +
          'If .env exists, make sure DATABASE_URL is set in it.'
      );
    }

    // Disable prefetch for serverless/edge environments
    client = postgres(connectionString, {
      prepare: false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    db = drizzle(client, { schema });
  }

  return db;
}

export type DB = ReturnType<typeof getDb>;
