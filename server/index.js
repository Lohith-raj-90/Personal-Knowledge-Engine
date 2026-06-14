import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { getDb, flushDb } from './db/database.js';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import chatRoutes from './routes/chats.js';
import learningRoutes from './routes/learning.js';
import graphRoutes from './routes/graph.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

const uploadDir = process.env.UPLOAD_DIR || join(__dirname, 'uploads');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

const publicDir = join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/learning-paths', learningRoutes);
app.use('/api/graph', graphRoutes);

app.get('*', (req, res) => {
    res.sendFile(join(publicDir, 'index.html'));
});

getDb().then(() => {
    app.listen(PORT, () => {
        console.log(`PKE Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Flush pending debounced DB writes on shutdown
process.on('SIGTERM', () => { flushDb(); process.exit(0); });
process.on('SIGINT', () => { flushDb(); process.exit(0); });
process.on('exit', flushDb);
