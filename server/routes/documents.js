import { Router } from 'express';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync } from 'fs';
import { getDb, run, get, all } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { extractText } from '../services/extract.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        await getDb();
        const docs = all('SELECT id, filename, file_type, page_count, file_size, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const ext = req.file.originalname.split('.').pop().toLowerCase();
        const fileType = ['pdf', 'docx', 'txt'].includes(ext) ? ext : 'unknown';
        const { text, pageCount } = await extractText(req.file.path, fileType);
        await getDb();
        const result = run('INSERT INTO documents (user_id, filename, file_path, file_type, page_count, file_size, content_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, req.file.originalname, req.file.path, fileType, pageCount, req.file.size, text]);
        const doc = get('SELECT id, filename, file_type, page_count, file_size, created_at FROM documents WHERE id = ?', [result.lastInsertRowid]);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await getDb();
        const doc = get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!doc) return res.status(404).json({ error: 'Document not found' });
        try { unlinkSync(doc.file_path); } catch {}
        run('DELETE FROM documents WHERE id = ?', [doc.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
