import { Router } from 'express';
import Question from '../models/Question.js';

const router = Router();

// Create
router.post('/', async (req, res) => {
    try {
        const { text, options } = req.body;
        if (!text || !Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({ error: 'text and exactly 4 options are required' });
        }
        const correctCount = options.filter((o) => o.isCorrect === true).length;
        if (correctCount !== 1) {
            return res.status(400).json({ error: 'Exactly one option must be marked isCorrect=true' });
        }
        const q = await Question.create({ text, options });
        res.status(201).json(q);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create question', details: e.message });
    }
});

// Read all
router.get('/', async (_req, res) => {
    try {
        const items = await Question.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const item = await Question.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (e) {
        res.status(400).json({ error: 'Invalid id' });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const { text, options } = req.body;
        if (options) {
            if (!Array.isArray(options) || options.length !== 4) {
                return res.status(400).json({ error: 'Exactly 4 options are required' });
            }
            const correctCount = options.filter((o) => o.isCorrect === true).length;
            if (correctCount !== 1) {
                return res.status(400).json({ error: 'Exactly one option must be marked isCorrect=true' });
            }
        }
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            { $set: { ...(text !== undefined ? { text } : {}), ...(options ? { options } : {}) } },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: 'Update failed', details: e.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Question.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ ok: true });
    } catch (e) {
        res.status(400).json({ error: 'Delete failed' });
    }
});

export default router;


