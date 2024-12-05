import express from 'express';
import { db } from '../index.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { name, subdomain, logoUrl } = req.body;

  try {
    const stmt = db.prepare(
      'INSERT INTO churches (name, subdomain, logo_url) VALUES (?, ?, ?)'
    );
    const result = stmt.run(name, subdomain, logoUrl);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const church = db
      .prepare('SELECT * FROM churches WHERE id = ?')
      .get(req.params.id);
    
    if (!church) {
      return res.status(404).json({ error: 'Church not found' });
    }
    
    res.json(church);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;