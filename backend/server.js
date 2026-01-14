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
    "https://sweet-shop-management-system-ruby.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.options("*", cors());

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
