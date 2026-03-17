const express = require('express');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'production_log.db');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function startServer() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      size TEXT NOT NULL,
      scrap INTEGER NOT NULL,
      parts INTEGER NOT NULL,
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDb();

  // API Routes

  // Get all entries (newest first)
  app.get('/api/entries', (req, res) => {
    const results = db.exec('SELECT id, name, date, type, size, scrap, parts, notes, created_at FROM entries ORDER BY date DESC, id DESC');
    if (results.length === 0) return res.json([]);

    const columns = results[0].columns;
    const rows = results[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => obj[col] = row[i]);
      return obj;
    });
    res.json(rows);
  });

  // Create a new entry
  app.post('/api/entries', (req, res) => {
    const { name, date, type, size, scrap, parts, notes } = req.body;

    if (!name || !date || !type || !size || scrap == null || parts == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
      'INSERT INTO entries (name, date, type, size, scrap, parts, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, date, type, size, scrap, parts, notes || '']
    );
    saveDb();

    const lastId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    res.status(201).json({ id: lastId });
  });

  // Delete an entry
  app.delete('/api/entries/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const before = db.getRowsModified ? db.getRowsModified() : 0;
    db.run('DELETE FROM entries WHERE id = ?', [id]);
    saveDb();
    res.json({ success: true });
  });

  // Start server on all network interfaces
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('===========================================');
    console.log('  Spin Production Log Server is running!');
    console.log('===========================================');
    console.log('');
    console.log(`  Local:   http://localhost:${PORT}`);

    const nets = require('os').networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  Network: http://${net.address}:${PORT}`);
        }
      }
    }

    console.log('');
    console.log('  Share the Network URL with coworkers!');
    console.log('  Press Ctrl+C to stop the server.');
    console.log('');
  });
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
