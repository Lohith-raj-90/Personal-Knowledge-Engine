import { Router } from 'express';
import { getDb, run, get, all } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        await getDb();
        const nodes = all('SELECT * FROM knowledge_nodes WHERE user_id = ?', [req.user.id]);
        const edges = all(`
            SELECT ke.* FROM knowledge_edges ke
            JOIN knowledge_nodes kn ON kn.id = ke.source_node_id
            WHERE kn.user_id = ?
        `, [req.user.id]);
        const clusters = all(`
            SELECT kc.*, (SELECT COUNT(*) FROM knowledge_nodes WHERE cluster_id = kc.id) as node_count
            FROM knowledge_clusters kc WHERE kc.user_id = ?
        `, [req.user.id]);
        res.json({ nodes, edges, clusters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/clusters', async (req, res) => {
    try {
        await getDb();
        const clusters = all(`
            SELECT kc.*, (SELECT COUNT(*) FROM knowledge_nodes WHERE cluster_id = kc.id) as node_count
            FROM knowledge_clusters kc WHERE kc.user_id = ? ORDER BY kc.created_at DESC
        `, [req.user.id]);
        res.json(clusters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/clusters', async (req, res) => {
    try {
        const { name, color } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        await getDb();
        const result = run('INSERT INTO knowledge_clusters (user_id, name, color) VALUES (?, ?, ?)', [req.user.id, name, color || '#4f9eff']);
        const cluster = get('SELECT * FROM knowledge_clusters WHERE id = ?', [result.lastInsertRowid]);
        res.json(cluster);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/nodes', async (req, res) => {
    try {
        await getDb();
        let nodes;
        if (req.query.cluster_id) {
            nodes = all('SELECT * FROM knowledge_nodes WHERE user_id = ? AND cluster_id = ?', [req.user.id, req.query.cluster_id]);
        } else {
            nodes = all('SELECT * FROM knowledge_nodes WHERE user_id = ?', [req.user.id]);
        }
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/nodes', async (req, res) => {
    try {
        const { title, content, node_type, cluster_id } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        await getDb();
        const result = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, cluster_id || null, title, content || '', node_type || 'concept']);
        const node = get('SELECT * FROM knowledge_nodes WHERE id = ?', [result.lastInsertRowid]);
        res.json(node);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/edges', async (req, res) => {
    try {
        await getDb();
        let edges;
        if (req.query.node_id) {
            edges = all(`
                SELECT ke.* FROM knowledge_edges ke
                JOIN knowledge_nodes kn ON kn.id = ke.source_node_id
                WHERE kn.user_id = ? AND (ke.source_node_id = ? OR ke.target_node_id = ?)
            `, [req.user.id, req.query.node_id, req.query.node_id]);
        } else {
            edges = all(`
                SELECT ke.* FROM knowledge_edges ke
                JOIN knowledge_nodes kn ON kn.id = ke.source_node_id
                WHERE kn.user_id = ?
            `, [req.user.id]);
        }
        res.json(edges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/edges', async (req, res) => {
    try {
        const { source_node_id, target_node_id, weight, edge_type } = req.body;
        if (!source_node_id || !target_node_id) return res.status(400).json({ error: 'Source and target node IDs are required' });
        await getDb();
        // Authorization: verify both nodes belong to the authenticated user
        const srcNode = get('SELECT id FROM knowledge_nodes WHERE id = ? AND user_id = ?', [source_node_id, req.user.id]);
        const tgtNode = get('SELECT id FROM knowledge_nodes WHERE id = ? AND user_id = ?', [target_node_id, req.user.id]);
        if (!srcNode || !tgtNode) return res.status(404).json({ error: 'One or both nodes not found' });
        const existing = get('SELECT id FROM knowledge_edges WHERE source_node_id = ? AND target_node_id = ?', [source_node_id, target_node_id]);
        if (existing) return res.status(409).json({ error: 'Edge already exists' });
        const result = run('INSERT INTO knowledge_edges (source_node_id, target_node_id, weight, edge_type) VALUES (?, ?, ?, ?)',
            [source_node_id, target_node_id, weight || 1.0, edge_type || 'related']);
        const edge = get('SELECT * FROM knowledge_edges WHERE id = ?', [result.lastInsertRowid]);
        res.json(edge);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
