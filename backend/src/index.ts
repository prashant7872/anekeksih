import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { prisma } from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: 'healthy',
      app: 'AnekEk Backend API',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Central error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 AnekEk Backend running on http://localhost:${PORT}`);
  console.log(`🤝 Worker-Owned Cooperative Platform (SIH 2026)`);
  console.log(`===============================================`);
});

export default app;
