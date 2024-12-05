import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

let db;

async function initDb() {
  const SQL = await initSqlJs();
  
  let buffer;
  if (existsSync(dbPath)) {
    buffer = readFileSync(dbPath);
  }
  
  db = new SQL.Database(buffer);
  
  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS churches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subdomain TEXT UNIQUE NOT NULL,
      logo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      church_id INTEGER,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (church_id) REFERENCES churches(id)
    );

    CREATE TABLE IF NOT EXISTS sermons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      church_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      speaker TEXT,
      series TEXT,
      video_url TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (church_id) REFERENCES churches(id)
    );
  `);
  
  // Save the database
  const data = db.export();
  writeFileSync(dbPath, Buffer.from(data));
  
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

function saveDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  const data = db.export();
  writeFileSync(dbPath, Buffer.from(data));
}

export { initDb, getDb, saveDb };