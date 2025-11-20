import * as sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

console.log('---- DATABASE CONFIGURATION ----');
console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_PASSWORD from env:', process.env.DB_PASSWORD);
console.log('DB_HOST from env:', process.env.DB_HOST);
console.log('DB_NAME from env:', process.env.DB_NAME);
console.log('DB_PORT from env:', process.env.DB_PORT);
console.log('------------------------------');

const sqlConfig: sql.config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'yourStrong#Password',
  database: process.env.DB_NAME || 'TasksDB',
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

poolConnect.catch(err => {
  console.error('Error connecting to SQL Server:', err);
});

export { pool, poolConnect };

export async function initializeDatabase() {
  try {
    await poolConnect;
    
    console.log('Successfully connected to the database. Schema initialization is handled by the SQL Server container.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}
