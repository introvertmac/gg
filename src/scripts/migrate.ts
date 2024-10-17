import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
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
