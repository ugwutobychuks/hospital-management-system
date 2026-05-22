import fs from "fs";
import path from "path";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const MIGRATIONS_DIR = path.resolve("migrations");

async function runMigrations() {
  try {
    await client.connect();
    console.log("Connected to database");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found");
      return;
    }

    for (const file of files) {
      const alreadyRun = await client.query(
        "SELECT 1 FROM migrations WHERE filename = $1",
        [file]
      );

      if (alreadyRun.rows.length > 0) {
        console.log(`Skipping: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(
        path.join(MIGRATIONS_DIR, file),
        "utf-8"
      );

      console.log(`Running: ${file}`);

      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO migrations(filename) VALUES($1)",
        [file]
      );
      await client.query("COMMIT");

      console.log(`Done: ${file}`);
    }

    console.log("All migrations completed");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

runMigrations();
