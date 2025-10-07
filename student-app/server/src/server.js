const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { runMigrations } = require('./db');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors());
app.use(express.json());

runMigrations();

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
