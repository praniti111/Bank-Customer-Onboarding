/**
 * server.js — Banking Customer Onboarding (KYC) Portal API
 * Scaffolded end-to-end with Slingshot Plan & Execute mode.
 */

require('dotenv').config(); // no-op if .env is absent — see .env.example

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const kycRoutes = require('./routes/kyc');
const adminRoutes = require('./routes/admin');
const { connect, usingMongo } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

// Security headers (CSP relaxed for the static, inline-script-free frontend).
app.use(helmet({ contentSecurityPolicy: false }));
// Request logging — method/path/status/response-time only, never the body,
// so no PII (full name, DOB, address, ID number) ever reaches the logs.
app.use(morgan('tiny'));
app.use(cors());
// Default express.json() limit is 100kb — too small for a base64-encoded
// document attachment. 10mb gives headroom above the 5MB file-size ceiling
// enforced in routes/kyc.js (base64 is ~4/3 the size of the raw file, so a
// 5MB file lands around 6.7MB encoded) — the app-level check in
// validateDocument() is what should reject an oversized file with a clean
// 400, not Express's raw body-size limit returning a generic 413.
app.use(express.json({ limit: '10mb' }));

// Serve the static frontend (customer + admin UI) from /frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'kyc-portal-backend',
    database: usingMongo ? 'mongodb' : 'json-file'
  });
});

app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
  (async () => {
    if (usingMongo) {
      await connect();
      console.log('Connected to MongoDB (MONGODB_URI is set).');
    } else {
      console.log('Using the flat-JSON-file store (set MONGODB_URI to use MongoDB instead).');
    }
    app.listen(PORT, () => {
      console.log(`KYC Portal backend listening on http://localhost:${PORT}`);
    });
  })().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

module.exports = app;
