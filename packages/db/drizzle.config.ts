import { defineConfig } from 'drizzle-kit';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment variables from project root
// Determines which .env file to load based on NODE_ENV or APP_ENV
// Priority: .env.{environment} > .env > process.env
const rootDir = resolve(__dirname, '../..');
const environment = process.env.NODE_ENV || process.env.APP_ENV || 'development';
const envFile = resolve(rootDir, `.env.${environment}`);
const defaultEnvFile = resolve(rootDir, '.env');

if (existsSync(envFile)) {
  dotenvConfig({ path: envFile });
} else if (existsSync(defaultEnvFile)) {
  dotenvConfig({ path: defaultEnvFile });
}

export default defineConfig({
  out: '../supabase/supabase/migrations',
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
