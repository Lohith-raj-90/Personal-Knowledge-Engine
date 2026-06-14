import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, run, get } from '../db/database.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pke-dev-secret';

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
        await getDb();
        const existing = get('SELECT id FROM users WHERE email = ?', [email]);
        if (existing) return res.status(409).json({ error: 'Email already registered' });
        const hash = bcrypt.hashSync(password, 10);
        const result = run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [email, hash, name || '']);
        const user = get('SELECT id, email, name, tier, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
        await getDb();
        const user = get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        const { password_hash, ...safeUser } = user;
        res.json({ user: safeUser, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ error: 'No token' });
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        await getDb();
        const user = get('SELECT id, email, name, tier, created_at FROM users WHERE id = ?', [decoded.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
