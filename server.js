const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// POST /expenses - Create a new expense
app.post('/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;

  // Basic validation
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category, and date are required' });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  const id = uuidv4();
  const expense = { id, amount, category, description, date, created_at: new Date().toISOString() };

  db.add(expense);
  res.status(201).json(expense);
});

// GET /expenses - List expenses with optional filters
app.get('/expenses', (req, res) => {
  const { category, sort } = req.query;

  let expenses = db.filter(category);

  if (sort === 'date_desc') {
    expenses = db.sortByDateDesc().filter(e => !category || e.category === category);
  }

  res.json(expenses);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});