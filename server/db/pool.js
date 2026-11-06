require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.PG_CONNECTION_STRING;

// Render's internal URL is a bare hostname on the private network and speaks
// plain TCP. The external URL crosses the public internet and requires TLS.
const isExternalUrl = (connectionString || '').includes('.render.com');

const devConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
};

const prodConfig = {
  connectionString,
  ssl: isExternalUrl ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(connectionString ? prodConfig : devConfig);

module.exports = pool;
