import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import sweetRoutes from './routes/sweets.js';

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS – FIXED */
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://sweet-shop-management-system-jsxr916r0.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

/* ✅ ROUTES (VERY IMPORTANT) */
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

/* ✅ HEALTH CHECK */
app.get('/', (req, res) => {
  res.send('Sweet Shop API is running');
});

/* ✅ START SERVER */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
