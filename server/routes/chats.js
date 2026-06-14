import { Router } from 'express';
import { getDb, run, get, all } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { search, indexDocument, isIndexed } from '../services/search.js';
import { generateResponse } from '../services/llm.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        await getDb();
        const chats = all('SELECT id, title, updated_at FROM chats WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        await getDb();
        const title = req.body.title || 'New Chat';
        const result = run('INSERT INTO chats (user_id, title) VALUES (?, ?)', [req.user.id, title]);
        const chat = get('SELECT id, title, created_at FROM chats WHERE id = ?', [result.lastInsertRowid]);
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/messages', async (req, res) => {
    try {
        await getDb();
        const chat = get('SELECT * FROM chats WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        const messages = all('SELECT id, role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC', [chat.id]);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/messages', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Message content is required' });
        await getDb();
        const chat = get('SELECT * FROM chats WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)', [chat.id, 'user', content]);

        // Lazily index only documents not yet in the search index (avoids full rebuild per message)
        const docs = all('SELECT * FROM documents WHERE user_id = ?', [req.user.id]);
        for (const doc of docs) {
            if (doc.content_text && !isIndexed(doc.id)) {
                indexDocument(doc.id, doc.content_text);
            }
        }
        const searchResults = search(content, req.user.id, docs);

        const history = all('SELECT role, content FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT 10', [chat.id]).reverse();
        const assistantContent = await generateResponse(history, searchResults);

        run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)', [chat.id, 'assistant', assistantContent]);
        run('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [chat.id]);

        if (chat.title === 'New Chat' && history.length <= 2) {
            run('UPDATE chats SET title = ? WHERE id = ?', [content.substring(0, 50), chat.id]);
        }

        const userMsg = all('SELECT id, role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT 2', [chat.id]);
        res.json({ user_msg: userMsg[1] || userMsg[0], assistant_msg: userMsg[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await getDb();
        const chat = get('SELECT * FROM chats WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        run('DELETE FROM chats WHERE id = ?', [chat.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
