const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'travelverse',
});

// Kubernetes Liveness & Readiness Probe endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM destinations ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Add a new destination
app.post('/api/destinations', async (req, res) => {
  const { name, country, description, price } = req.body;
  if (!name || !country || !description || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO destinations (name, country, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, country, description, Number(price)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// Delete a destination
app.delete('/api/destinations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM destinations WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

app.listen(PORT, () => {
  console.log(`TravelVerse API listening on port ${PORT}`);
});
