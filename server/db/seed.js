import { getDb, run, get, all, flushDb } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
    const db = await getDb();

    const existing = get('SELECT id FROM users WHERE email = ?', ['demo@pke.io']);
    if (existing) {
        console.log('Seed data already exists. Skipping.');
        process.exit(0);
    }

    console.log('Seeding database...');

    const hash = bcrypt.hashSync('demo123', 10);
    const userResult = run('INSERT INTO users (email, password_hash, name, tier) VALUES (?, ?, ?, ?)',
        ['demo@pke.io', hash, 'Lohith', 'pro']);
    const userId = userResult.lastInsertRowid;
    console.log(`Created user: demo@pke.io (id: ${userId})`);

    const docResult = run(
        'INSERT INTO documents (user_id, filename, file_path, file_type, page_count, file_size, content_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, 'research-paper.pdf', '/tmp/research-paper.pdf', 'pdf', 12, 2457600,
         'Quantum entanglement is a phenomenon where two particles become interconnected. The quantum state of each particle cannot be described independently. This has applications in quantum computing and secure communications. Superposition allows quantum systems to exist in multiple states simultaneously until measured.']
    );
    run(
        'INSERT INTO documents (user_id, filename, file_path, file_type, page_count, file_size, content_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, 'quarterly_strategy.docx', '/tmp/quarterly_strategy.docx', 'docx', 8, 1126400,
         'Q3 strategic priorities include expanding the knowledge management platform, integrating AI-powered document analysis, and building collaborative features for research teams. Key metrics show 40% increase in document processing efficiency.']
    );
    console.log('Created 2 sample documents');

    const chatResult = run('INSERT INTO chats (user_id, title) VALUES (?, ?)', [userId, 'Synthesis of Q3 papers']);
    const chatId = chatResult.lastInsertRowid;
    run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
        [chatId, 'user', 'Summarize the key findings from my research papers']);
    run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
        [chatId, 'assistant', 'Based on your documents, here are the key findings:\n\n1. Quantum entanglement enables secure communication channels\n2. Superposition is fundamental to quantum computing\n3. Your Q3 strategy shows 40% efficiency improvement\n\nThese insights connect your quantum research with practical business applications.']);

    const chat2 = run('INSERT INTO chats (user_id, title) VALUES (?, ?)', [userId, 'Key findings from legal docs']);
    run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
        [chat2.lastInsertRowid, 'user', 'What are the main compliance requirements?']);
    run('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)',
        [chat2.lastInsertRowid, 'assistant', 'The main compliance requirements from your documents include:\n\n1. Data protection and privacy regulations\n2. Document retention policies\n3. Access control and audit logging\n4. Regular security assessments']);
    console.log('Created 2 sample chats with messages');

    const pathResult = run('INSERT INTO learning_paths (user_id, title, category, progress) VALUES (?, ?, ?, ?)',
        [userId, 'Mastering Quantum Mechanics', 'physics', 65]);
    const pathId = pathResult.lastInsertRowid;
    run('INSERT INTO flashcards (learning_path_id, question, answer, difficulty) VALUES (?, ?, ?, ?)',
        [pathId, 'What is the Heisenberg Uncertainty Principle?', 'It states that one cannot simultaneously measure the exact position and momentum of a particle with arbitrary precision.', 'medium']);
    run('INSERT INTO flashcards (learning_path_id, question, answer, difficulty) VALUES (?, ?, ?, ?)',
        [pathId, 'What is quantum tunneling?', 'A quantum mechanical effect where a particle passes through a potential barrier that it classically could not surmount.', 'hard']);
    run('INSERT INTO flashcards (learning_path_id, question, answer, difficulty) VALUES (?, ?, ?, ?)',
        [pathId, 'What is wave-particle duality?', 'The concept that every particle exhibits both wave and particle properties.', 'easy']);

    const path2 = run('INSERT INTO learning_paths (user_id, title, category, progress) VALUES (?, ?, ?, ?)',
        [userId, 'Legal Synthesis 101', 'legal', 22]);
    run('INSERT INTO flashcards (learning_path_id, question, answer, difficulty) VALUES (?, ?, ?, ?)',
        [path2.lastInsertRowid, 'What is E-Discovery?', 'The process of identifying and producing electronically stored information in response to a legal request.', 'easy']);
    console.log('Created 2 learning paths with flashcards');

    const cluster1 = run('INSERT INTO knowledge_clusters (user_id, name, color) VALUES (?, ?, ?)', [userId, 'Research Hub', '#4f9eff']);
    const cluster2 = run('INSERT INTO knowledge_clusters (user_id, name, color) VALUES (?, ?, ?)', [userId, 'Legal Documents', '#00e0b3']);
    const cluster3 = run('INSERT INTO knowledge_clusters (user_id, name, color) VALUES (?, ?, ?)', [userId, 'Technical Specs', '#cebdff']);

    const node1 = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
        [userId, cluster1.lastInsertRowid, 'Quantum Entanglement', 'Spooky action at a distance between particles', 'concept']);
    const node2 = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
        [userId, cluster1.lastInsertRowid, 'Superposition', 'Quantum states existing in multiple configurations', 'concept']);
    const node3 = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
        [userId, cluster1.lastInsertRowid, 'Wave Function', 'Mathematical description of quantum state', 'concept']);
    const node4 = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
        [userId, cluster2.lastInsertRowid, 'Compliance Framework', 'Legal requirements for data handling', 'document']);
    const node5 = run('INSERT INTO knowledge_nodes (user_id, cluster_id, title, content, node_type) VALUES (?, ?, ?, ?, ?)',
        [userId, cluster3.lastInsertRowid, 'Qubit Architecture', 'Physical implementation of quantum bits', 'concept']);

    run('INSERT INTO knowledge_edges (source_node_id, target_node_id, weight, edge_type) VALUES (?, ?, ?, ?)',
        [node1.lastInsertRowid, node2.lastInsertRowid, 0.9, 'related']);
    run('INSERT INTO knowledge_edges (source_node_id, target_node_id, weight, edge_type) VALUES (?, ?, ?, ?)',
        [node2.lastInsertRowid, node3.lastInsertRowid, 0.8, 'related']);
    run('INSERT INTO knowledge_edges (source_node_id, target_node_id, weight, edge_type) VALUES (?, ?, ?, ?)',
        [node1.lastInsertRowid, node3.lastInsertRowid, 0.7, 'depends_on']);
    run('INSERT INTO knowledge_edges (source_node_id, target_node_id, weight, edge_type) VALUES (?, ?, ?, ?)',
        [node5.lastInsertRowid, node2.lastInsertRowid, 0.6, 'supports']);
    console.log('Created 3 clusters, 5 nodes, 4 edges');

    console.log('\nSeed complete!');
    console.log('Login with: demo@pke.io / demo123');
    flushDb();
    process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
