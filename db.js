const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./expenses.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;