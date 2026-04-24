const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'nutrismart.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      age INTEGER,
      weight_kg REAL,
      height_cm REAL,
      dietary_preference TEXT DEFAULT 'none',
      daily_calorie_goal INTEGER DEFAULT 2000,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      meal_type TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories REAL NOT NULL,
      protein_g REAL DEFAULT 0,
      carbs_g REAL DEFAULT 0,
      fat_g REAL DEFAULT 0,
      fiber_g REAL DEFAULT 0,
      notes TEXT,
      logged_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      food_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      calories REAL,
      protein_g REAL,
      carbs_g REAL,
      fat_g REAL,
      category TEXT,
      is_dismissed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS nudges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      nudge_type TEXT NOT NULL,
      schedule_time TEXT,
      is_active INTEGER DEFAULT 1,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
    CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON meals(logged_at);
    CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
    CREATE INDEX IF NOT EXISTS idx_nudges_user_id ON nudges(user_id);
  `);

  console.log('✅ Database initialized successfully');
}

module.exports = { db, initializeDatabase };
