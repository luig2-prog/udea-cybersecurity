import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes/taskRoutes';
import { initializeDatabase } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Database connection established successfully`);
      });
    } else {
      console.log('Database initialized. Server not started in test environment by index.ts.');
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      console.error('Database initialization failed during test environment setup. Tests will likely fail.');
    }
  }
};

if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
