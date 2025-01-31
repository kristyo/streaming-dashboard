const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./streams.db');

class Stream {
  static init() {
    db.run(`
      CREATE TABLE IF NOT EXISTS streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT,
        rtmp_url TEXT,
        status TEXT,
        pid INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static getSystemStatus() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          COUNT(*) as total_streams,
          SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as active_streams
        FROM streams
      `, (err, rows) => {
        if (err) reject(err);
        resolve(rows[0]);
      });
    });
  }
}

module.exports = Stream;