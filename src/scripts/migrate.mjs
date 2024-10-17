import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  console.error('NEXT_PUBLIC_DATABASE_URL is not set in the environment variables');
  process.exit(1);
}

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
const db = drizzle(sql);

async function runMigrations() {
  const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));

  for (const file of migrationFiles) {
    const migration = fs.readFileSync(path.join(__dirname, '../migrations', file), 'utf8');
    console.log(`Running migration: ${file}`);
    await db.execute(migration);
    console.log(`Completed migration: ${file}`);
  }
}

runMigrations()
  .then(() => console.log('Migrations completed successfully'))
  .catch((error) => console.error('Migration failed:', error))
  .finally(() => process.exit());

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;
