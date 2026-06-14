import { Router } from 'express';
import { getDb, run, get, all } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        await getDb();
        const paths = all(`
            SELECT lp.*, (SELECT COUNT(*) FROM flashcards WHERE learning_path_id = lp.id) as flashcard_count
            FROM learning_paths lp WHERE lp.user_id = ? ORDER BY lp.created_at DESC
        `, [req.user.id]);
        res.json(paths);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        await getDb();
        const result = run('INSERT INTO learning_paths (user_id, title, category) VALUES (?, ?, ?)', [req.user.id, title, category || 'general']);
        const path = get('SELECT * FROM learning_paths WHERE id = ?', [result.lastInsertRowid]);
        res.json(path);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/flashcards', async (req, res) => {
    try {
        await getDb();
        const path = get('SELECT * FROM learning_paths WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!path) return res.status(404).json({ error: 'Learning path not found' });
        const cards = all('SELECT * FROM flashcards WHERE learning_path_id = ? ORDER BY created_at ASC', [path.id]);
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/flashcards', async (req, res) => {
    try {
        const { question, answer, difficulty } = req.body;
        if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });
        await getDb();
        const path = get('SELECT * FROM learning_paths WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!path) return res.status(404).json({ error: 'Learning path not found' });
        const result = run('INSERT INTO flashcards (learning_path_id, question, answer, difficulty) VALUES (?, ?, ?, ?)',
            [path.id, question, answer, difficulty || 'medium']);
        const card = get('SELECT * FROM flashcards WHERE id = ?', [result.lastInsertRowid]);
        res.json(card);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/flashcards/:id/review', async (req, res) => {
    try {
        const { difficulty } = req.body;
        await getDb();
        const card = get(`
            SELECT fc.* FROM flashcards fc
            JOIN learning_paths lp ON lp.id = fc.learning_path_id
            WHERE fc.id = ? AND lp.user_id = ?
        `, [req.params.id, req.user.id]);
        if (!card) return res.status(404).json({ error: 'Flashcard not found' });
        run('UPDATE flashcards SET difficulty = ?, last_reviewed = CURRENT_TIMESTAMP WHERE id = ?', [difficulty || card.difficulty, card.id]);

        const total = get('SELECT COUNT(*) as cnt FROM flashcards WHERE learning_path_id = ?', [card.learning_path_id]);
        const reviewed = get("SELECT COUNT(*) as cnt FROM flashcards WHERE learning_path_id = ? AND last_reviewed IS NOT NULL", [card.learning_path_id]);
        const progress = total.cnt > 0 ? Math.round((reviewed.cnt / total.cnt) * 100) : 0;
        run('UPDATE learning_paths SET progress = ? WHERE id = ?', [progress, card.learning_path_id]);

        const updated = get('SELECT * FROM flashcards WHERE id = ?', [card.id]);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
