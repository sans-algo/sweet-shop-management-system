import express from 'express';
import Sweet from '../models/Sweet.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({ message: 'SWEETS ROUTE WORKING' });
});

// ✅ Get all sweets
router.get('/', protect, async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
});

// ✅ Add sweet (ADMIN)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create sweet' });
  }
});

// ✅ Update sweet (ADMIN)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update sweet' });
  }
});

// ✅ Delete sweet (ADMIN)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sweet deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete sweet' });
  }
});

// ✅ Purchase sweet (CUSTOMER)
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet || sweet.quantity < 1) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: 'Purchase failed' });
  }
});

// ✅ Restock sweet (ADMIN)
router.post('/:id/restock', protect, adminOnly, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    sweet.quantity += req.body.quantity;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: 'Restock failed' });
  }
});

export default router;
