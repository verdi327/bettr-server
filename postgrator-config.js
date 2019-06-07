'use strict';

const dotenv = require('dotenv');
let envFile;
if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
} else if (process.env.NODE_ENV === 'production') {
  envFile = '.env.production';
} else {
  envFile = '.env';
}

dotenv.config({ path: envFile });

module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'host': process.env.MIGRATION_DB_HOST,
  'port': process.env.MIGRATION_DB_PORT,
  'database': process.env.MIGRATION_DB_NAME,
  'username': process.env.MIGRATION_DB_USER,
  'password': process.env.MIGRATION_DB_PASSWORD || '',
  'ssl': process.env.NODE_ENV === 'production' ? true : false
};