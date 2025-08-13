import { Router } from 'express';
import Question from '../models/Question.js';

const router = Router();

// Start test: optionally randomize
router.get('/start', async (req, res) => {
    try {
        const random = (req.query.random || 'true') === 'true';
        let questions = await Question.find();
        if (random) {
            questions = questions.sort(() => Math.random() - 0.5);
        }
        // Send without revealing correct answers
        const payload = questions.map((q) => ({
            id: q._id.toString(),
            text: q.text,
            options: q.options.map((o, idx) => ({ index: idx, text: o.text })),
        }));
        res.json({ questions: payload });
    } catch (e) {
        res.status(500).json({ error: 'Failed to start test' });
    }
});

// Submit test: body { answers: [{ id, selectedIndex }] }
router.post('/submit', async (req, res) => {
    try {
        const { answers } = req.body;
        if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers must be an array' });
        const ids = answers.map((a) => a.id);
        const questions = await Question.find({ _id: { $in: ids } });
        const questionById = new Map(questions.map((q) => [q._id.toString(), q]));
        let correct = 0;
        const details = answers.map((a) => {
            const q = questionById.get(a.id);
            if (!q) return { id: a.id, correct: false };
            const correctIndex = q.getCorrectIndex();
            const selectedIndex = a.selectedIndex !== undefined && a.selectedIndex !== null ? Number(a.selectedIndex) : null;
            const isCorrect = Number(selectedIndex) === Number(correctIndex);
            if (isCorrect) correct += 1;
            return {
                id: a.id,
                text: q.text,
                options: q.options.map((o, idx) => ({ index: idx, text: o.text })),
                selectedIndex,
                correctIndex,
                correct: isCorrect,
            };
        });
        const total = answers.length;
        const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
        res.json({ total, correct, percent, details });
    } catch (e) {
        res.status(500).json({ error: 'Failed to submit test' });
    }
});

export default router;


