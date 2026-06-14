# PKE Full-Stack Implementation Plan

## Current State Assessment

14 standalone HTML files across `stitch_pke_final/`. All self-contained single-file HTML with Tailwind CDN, no `fetch()` calls, no backend. Two near-identical landing pages, two byte-identical auth pages, two standalone Three.js demos, and three app dashboards (knowledge graph, dashboard, learning hub).

---

## Architecture Decisions

### Directory Structure

```
s-pke_final/
├── server/                          # Backend (Node.js)
│   ├── package.json
│   ├── index.js                     # Express entry point
│   ├── db/
│   │   ├── schema.sql               # DDL
│   │   └── database.js              # SQLite connection + migrations
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js                  # POST register, login, GET me
│   │   ├── documents.js             # CRUD + upload + extract
│   │   ├── chats.js                 # CRUD + messages
│   │   ├── learning.js              # paths + flashcards
│   │   └── graph.js                 # nodes, edges, clusters
│   ├── services/
│   │   ├── extract.js               # PDF/DOCX text extraction
│   │   ├── search.js                # TF-IDF indexing + cosine similarity
│   │   └── llm.js                   # OpenAI wrapper with mock fallback
│   └── uploads/                     # Uploaded document storage
│
├── public/                          # Frontend (static files)
│   ├── index.html                   # SPA shell
│   ├── css/
│   │   ├── shared.css               # Extracted design tokens + glass classes
│   │   └── pages/
│   │       ├── landing.css
│   │       ├── auth.css
│   │       ├── dashboard.css
│   │       ├── graph.css
│   │       └── learn.css
│   ├── js/
│   │   ├── app.js                   # Bootstrap + router init
│   │   ├── router.js                # Hash-based SPA router
│   │   ├── api.js                   # Fetch wrapper with JWT
│   │   ├── auth.js                  # Token storage + auth state
│   │   ├── components/
│   │   │   ├── sidebar.js           # Shared sidebar for app pages
│   │   │   ├── header.js            # Shared top header
│   │   │   ├── three-crystal.js     # Crystal animation (from three.js_1)
│   │   │   └── three-neural.js      # Neural core animation (from three.js_2)
│   │   └── pages/
│   │       ├── landing.js           # Landing page
│   │       ├── login.js             # Login page
│   │       ├── signup.js            # Signup page
│   │       ├── dashboard.js         # Chat dashboard
│   │       ├── graph.js             # Knowledge graph
│   │       └── learn.js             # Learning hub
│   └── assets/
│       └── noise.png                # Download grain texture for local use
│
└── IMPLEMENTATION_PLAN.md           # This file
```

### Key Design Decisions

1. **Keep Tailwind CDN for MVP** — The prototypes already use it; migrating to build-time Tailwind adds complexity with no user-facing benefit at this stage.
2. **Hash-based routing** (`#/login`, `#/dashboard`, `#/graph`, `#/learn`) — No server config needed, works with static file serving, no history API complexity.
3. **Page modules return HTML strings + mount/unmount lifecycle** — Each page is a JS module with `render()` (returns HTML string), `mount()` (binds events), `unmount()` (cleanup). Router calls these.
4. **Three.js animations as reusable components** — Extracted into `components/three-crystal.js` and `components/three-neural.js`, instantiated by pages that need them.
5. **SQLite with better-sqlite3** — Synchronous API, no connection pooling complexity, single file database, perfect for MVP.
6. **TF-IDF for vector search** — No external embedding service. Build a simple in-memory TF-IDF index per document, compute cosine similarity at query time. Sufficient for MVP with <1000 documents.
7. **Mock LLM fallback** — Server checks for `OPENAI_API_KEY` env var. If absent, returns pre-written responses that demonstrate the UI flow.

---

## Database Schema

```sql
-- server/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT DEFAULT '',
    tier TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    page_count INTEGER DEFAULT 0,
    file_size INTEGER DEFAULT 0,
    content_text TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_path_id INTEGER NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
    last_reviewed DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_clusters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#4f9eff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cluster_id INTEGER REFERENCES knowledge_clusters(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    node_type TEXT DEFAULT 'concept' CHECK(node_type IN ('concept', 'document', 'person', 'event', 'question')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_node_id INTEGER NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    target_node_id INTEGER NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    weight REAL DEFAULT 1.0,
    edge_type TEXT DEFAULT 'related' CHECK(edge_type IN ('related', 'depends_on', 'part_of', 'contradicts', 'supports')),
    UNIQUE(source_node_id, target_node_id)
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_path ON flashcards(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_user ON knowledge_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_cluster ON knowledge_nodes(cluster_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_source ON knowledge_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_target ON knowledge_edges(target_node_id);
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| POST | `/api/auth/register` | `{email, password, name}` | `{user, token}` | bcrypt hash, JWT sign |
| POST | `/api/auth/login` | `{email, password}` | `{user, token}` | Verify password, return JWT |
| GET | `/api/auth/me` | — | `{user}` | Protected, returns current user from JWT |

### Documents

| Method | Endpoint | Body/Query | Response | Notes |
|--------|----------|-----------|----------|-------|
| GET | `/api/documents` | — | `[{id, filename, file_type, page_count, file_size, created_at}]` | Protected, list user's docs |
| POST | `/api/documents` | `multipart/form-data` (file) | `{id, filename, file_type, page_count, file_size}` | Upload + extract text |
| DELETE | `/api/documents/:id` | — | `{success: true}` | Delete doc + file from disk |

### Chats

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/api/chats` | — | `[{id, title, updated_at}]` | List user's chats, newest first |
| POST | `/api/chats` | `{title?}` | `{id, title}` | Create new chat |
| GET | `/api/chats/:id/messages` | — | `[{id, role, content, created_at}]` | Get messages for a chat |
| POST | `/api/chats/:id/messages` | `{content}` | `{user_msg, assistant_msg}` | Send message, get LLM response |

### Learning

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/api/learning-paths` | — | `[{id, title, category, progress, flashcard_count}]` | List paths |
| POST | `/api/learning-paths` | `{title, category}` | `{id, title, category}` | Create path |
| GET | `/api/learning-paths/:id/flashcards` | — | `[{id, question, answer, difficulty}]` | List flashcards for path |
| POST | `/api/learning-paths/:id/flashcards` | `{question, answer, difficulty}` | `{id, question, answer}` | Add flashcard |
| PATCH | `/api/flashcards/:id/review` | `{difficulty}` | `{id, last_reviewed}` | Update review status |

### Knowledge Graph

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/api/graph/clusters` | — | `[{id, name, color, node_count}]` | List clusters |
| POST | `/api/graph/clusters` | `{name, color}` | `{id, name, color}` | Create cluster |
| GET | `/api/graph/nodes` | `?cluster_id=` | `[{id, title, content, node_type, cluster_id}]` | List nodes |
| POST | `/api/graph/nodes` | `{title, content, node_type, cluster_id?}` | `{id, title, node_type}` | Create node |
| GET | `/api/graph/edges` | `?node_id=` | `[{id, source_node_id, target_node_id, weight, edge_type}]` | List edges |
| POST | `/api/graph/edges` | `{source_node_id, target_node_id, weight?, edge_type?}` | `{id, weight}` | Create edge |
| GET | `/api/graph` | — | `{nodes: [...], edges: [...], clusters: [...]}` | Full graph for visualization |

---

## Page Module Interface

Every page module in `public/js/pages/*.js` exports:

```javascript
// Example: pages/dashboard.js
export default {
    // Returns HTML string for the page
    render() { return `<div class="dashboard">...</div>`; },

    // Called after DOM is inserted. Bind events, start animations, fetch data.
    async mount(params) {
        // params = route params like {id: "5"}
        await loadChats();
        initThreeCrystal();
    },

    // Called before page is removed. Clean up intervals, event listeners, animations.
    unmount() {
        stopThreeCrystal();
    }
};
```

The router calls `currentPage.unmount()`, swaps innerHTML, then calls `currentPage.mount(params)`.

---

## Implementation Phases

### Phase 1: Project Scaffolding

**Files to create:**
- `server/package.json`
- `server/index.js`
- `server/db/schema.sql`
- `server/db/database.js`
- `public/index.html`
- `public/js/app.js`
- `public/js/router.js`
- `public/js/api.js`
- `public/js/auth.js`
- `public/css/shared.css`

**Steps:**

1. Create `server/package.json` with dependencies:
   ```json
   {
     "name": "pke-server",
     "type": "module",
     "scripts": { "start": "node index.js", "dev": "node --watch index.js" },
     "dependencies": {
       "express": "^4.18.0",
       "better-sqlite3": "^11.0.0",
       "bcryptjs": "^2.4.3",
       "jsonwebtoken": "^9.0.0",
       "multer": "^1.4.5-lts.1",
       "pdf-parse": "^1.1.1",
       "mammoth": "^1.6.0",
       "cors": "^2.8.5",
       "dotenv": "^16.4.0"
     }
   }
   ```

2. Create `server/index.js` — Express app that:
   - Loads `dotenv`
   - Serves `public/` as static files
   - Mounts API routes under `/api`
   - Creates `uploads/` directory if missing
   - Initializes database on startup
   - Listens on `PORT` env var or 3000

3. Create `server/db/database.js` — Exports a singleton `better-sqlite3` instance. On first call, reads `schema.sql` and runs it.

4. Create `public/index.html` — SPA shell:
   ```html
   <!DOCTYPE html>
   <html lang="en" class="dark">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>PKE — Personal Knowledge Engine</title>
       <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
       <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
       <link rel="stylesheet" href="/css/shared.css">
       <script>
           tailwind.config = {
               theme: {
                   extend: {
                       colors: {
                           surface: '#101419',
                           'surface-dim': '#101419',
                           'surface-bright': '#363a3f',
                           'surface-container-lowest': '#0b0e13',
                           'surface-container-low': '#181c21',
                           'surface-container': '#1c2025',
                           'surface-container-high': '#262a2f',
                           'surface-container-highest': '#31353a',
                           primary: '#4f9eff',
                           'primary-container': '#005bad',
                           secondary: '#cebdff',
                           'secondary-container': '#5b42a0',
                           tertiary: '#ffb867',
                           'tertiary-container': '#7d4e00',
                           outline: '#8d9199',
                           'outline-variant': '#41474d',
                           'on-surface': '#e1e3e8',
                           'on-surface-variant': '#c1c7ce',
                       },
                       fontFamily: {
                           heading: ['Sora', 'sans-serif'],
                           body: ['Plus Jakarta Sans', 'sans-serif'],
                           mono: ['JetBrains Mono', 'monospace'],
                       },
                       borderRadius: {
                           'sm': '8px',
                           'md': '12px',
                           'lg': '16px',
                           'xl': '28px',
                       }
                   }
               }
           }
       </script>
   </head>
   <body class="bg-surface text-on-surface font-body">
       <div id="app"></div>
       <script type="module" src="/js/app.js"></script>
   </body>
   </html>
   ```

5. Create `public/js/router.js` — Hash-based router:
   - Listens to `hashchange` event
   - Maps routes: `#/` → landing, `#/login` → login, `#/signup` → signup, `#/dashboard` → dashboard, `#/graph` → graph, `#/learn` → learn
   - On route change: calls `currentPage.unmount()`, dynamically imports page module, sets `#app` innerHTML to `page.render()`, calls `page.mount()`
   - Supports route params: `#/chat/:id` → extracts `id`

6. Create `public/js/api.js` — Fetch wrapper:
   - `api.get(path)`, `api.post(path, body)`, `api.del(path)`, `api.upload(path, formData)`
   - Automatically attaches `Authorization: Bearer <token>` header
   - Handles 401 by clearing token and redirecting to `#/login`
   - Returns parsed JSON

7. Create `public/js/auth.js` — Auth state manager:
   - `getToken()`, `setToken(token)`, `clearToken()` — localStorage
   - `getUser()` — decoded JWT payload (or null)
   - `isAuthenticated()` — checks token existence + expiry
   - `logout()` — clears token, redirects to `#/login`

8. Create `public/js/app.js` — Bootstrap:
   - Imports router, initializes it
   - If no token and route is protected, redirect to `#/login`
   - Loads shared CSS

9. Create `public/css/shared.css` — Extracted from prototypes:
   - Glass card classes (`.glass-card`, `.glass-panel`, `.luminous-border`)
   - Grain texture overlay (`.grain-overlay`)
   - Core glow, text glow effects
   - Material Symbols icon sizing
   - Scrollbar styling
   - Base body styles

---

### Phase 2: Backend Core

**Files to create:**
- `server/middleware/auth.js`
- `server/routes/auth.js`
- `server/routes/documents.js`
- `server/services/extract.js`

**Steps:**

1. `server/middleware/auth.js` — JWT verification middleware:
   - Extracts token from `Authorization: Bearer <token>` header
   - Verifies with `JWT_SECRET` env var (fallback to `pke-dev-secret`)
   - Attaches `req.user = {id, email, name}` on success
   - Returns 401 on failure

2. `server/routes/auth.js` — Auth routes:
   - `POST /register`: validate email/password/name, hash password with bcryptjs (10 rounds), insert user, sign JWT (24h expiry), return `{user: {id, email, name}, token}`
   - `POST /login`: find user by email, compare password, sign JWT, return same shape
   - `GET /me`: protected route, return `req.user` from token

3. `server/routes/documents.js` — Document routes (all protected):
   - `GET /`: query documents for user, return list
   - `POST /`: use multer for file upload (store in `uploads/<user_id>/`), call `extract.js` to get text, insert into DB, return doc metadata
   - `DELETE /:id`: verify ownership, delete file from disk, delete from DB

4. `server/services/extract.js` — Text extraction:
   - `extractText(filePath, fileType)` — returns extracted text string
   - PDF: use `pdf-parse` to extract text page by page
   - DOCX: use `mammoth` to extract raw text
   - TXT: read file directly
   - Return `{text, pageCount}`

---

### Phase 3: Chat + RAG System

**Files to create:**
- `server/routes/chats.js`
- `server/services/search.js`
- `server/services/llm.js`

**Steps:**

1. `server/routes/chats.js` — Chat routes (all protected):
   - `GET /`: list user's chats ordered by `updated_at DESC`
   - `POST /`: create chat with optional title, default "New Chat"
   - `GET /:id/messages`: verify ownership, return messages
   - `POST /:id/messages`: verify ownership, save user message, build context (last 10 messages + document search results), call LLM, save assistant message, update chat `updated_at`, return both messages

2. `server/services/search.js` — TF-IDF search:
   - `indexDocument(docId, text)` — tokenize text into words, compute TF per word, store in-memory Map
   - `search(query, userId, limit=5)` — tokenize query, compute TF-IDF similarity against all indexed docs for user, return top `limit` document snippets (200 chars each)
   - Use simple tokenization: lowercase, split on non-alpha, remove stopwords (the, is, at, etc.)
   - Cosine similarity: dot product of query vector and document vector / (||query|| * ||doc||)

3. `server/services/llm.js` — LLM integration:
   - Check for `OPENAI_API_KEY` env var
   - If present: call OpenAI chat completions API with system prompt + context + messages
   - If absent: return mock responses that reference the query topic realistically
   - System prompt template:
     ```
     You are PKE AI, a personal knowledge assistant. You help users understand
     their documents and knowledge base. Be concise and helpful.
     
     Relevant documents from the user's knowledge base:
     {search_results}
     ```

4. Wire up routes in `server/index.js`:
   ```javascript
   import authRoutes from './routes/auth.js';
   import documentRoutes from './routes/documents.js';
   import chatRoutes from './routes/chats.js';
   
   app.use('/api/auth', authRoutes);
   app.use('/api/documents', documentRoutes);
   app.use('/api/chats', chatRoutes);
   ```

---

### Phase 4: Learning + Graph APIs

**Files to create:**
- `server/routes/learning.js`
- `server/routes/graph.js`

**Steps:**

1. `server/routes/learning.js` — Learning routes (all protected):
   - `GET /paths`: list user's learning paths with flashcard count
   - `POST /paths`: create learning path
   - `GET /paths/:id/flashcards`: list flashcards for a path
   - `POST /paths/:id/flashcards`: add flashcard to path
   - `PATCH /flashcards/:id/review`: update `last_reviewed` timestamp and difficulty

2. `server/routes/graph.js` — Knowledge graph routes (all protected):
   - `GET /clusters`: list clusters with node count
   - `POST /clusters`: create cluster
   - `GET /nodes`: list nodes, optionally filter by cluster
   - `POST /nodes`: create node
   - `GET /edges`: list edges, optionally filter by node
   - `POST /edges`: create edge
   - `GET /` (full graph): return all nodes, edges, and clusters for user in one call (for visualization)

3. Wire up in `server/index.js`:
   ```javascript
   import learningRoutes from './routes/learning.js';
   import graphRoutes from './routes/graph.js';
   
   app.use('/api/learning-paths', learningRoutes);
   app.use('/api/graph', graphRoutes);
   ```

---

### Phase 5: Frontend Pages

**Files to create:**
- `public/js/components/sidebar.js`
- `public/js/components/header.js`
- `public/js/components/three-crystal.js`
- `public/js/components/three-neural.js`
- `public/js/pages/landing.js`
- `public/js/pages/login.js`
- `public/js/pages/signup.js`
- `public/js/pages/dashboard.js`
- `public/js/pages/graph.js`
- `public/js/pages/learn.js`
- `public/css/pages/*.css` (per-page styles)

**Steps:**

1. **Extract shared components:**
   - `components/sidebar.js` — Adapt from `pke_dashboard` and `knowledge_graph_animation_2` sidebar. Export `renderSidebar(activePage)` returning HTML string. Active page gets highlight styling.
   - `components/header.js` — Top bar with PKE logo, search input, user menu. Export `renderHeader()`.
   - `components/three-crystal.js` — Extract from `three.js_1` (125 lines). Export `initCrystal(containerId)` and `disposeCrystal()`. Returns Three.js scene with crystal icosahedron, particles, blue+violet lights.
   - `components/three-neural.js` — Extract from `three.js_2` (142 lines). Export `initNeural(containerId)` and `disposeNeural()`. Returns wireframe icosahedron with organic deformation.

2. **Landing page** (`pages/landing.js`):
   - Extract HTML structure from `pke_landing_page_refined/code.html`
   - Hero section with CTA buttons linking to `#/signup`
   - Feature grid
   - Bento showcase
   - Footer with nav links
   - No sidebar (public page)
   - Add smooth scroll for anchor links

3. **Login page** (`pages/login.js`):
   - Extract from `pke_secure_access/code.html`
   - Replace `alert()` mock with actual `api.post('/api/auth/login', {email, password})`
   - On success: `auth.setToken(token)`, redirect to `#/dashboard`
   - On error: show inline error message
   - Google/GitHub OAuth buttons → show "Coming soon" toast (OAuth requires provider setup)

4. **Signup page** (`pages/signup.js`):
   - Clone login page, modify for registration
   - Add `name` field
   - Call `api.post('/api/auth/register', {email, password, name})`
   - On success: auto-login and redirect to `#/dashboard`

5. **Dashboard page** (`pages/dashboard.js`):
   - Extract from `pke_dashboard/code.html`
   - Replace hardcoded chat list with `api.get('/chats')` fetch
   - Chat input: on Enter/submit, call `api.post('/chats/:id/messages', {content})`, append both messages to chat
   - Streaming: use `fetch` with `ReadableStream` if backend supports SSE, otherwise append after full response
   - Three.js crystal in hero area using `three-crystal.js` component
   - New chat button → `api.post('/chats')` → redirect to chat view
   - Document list section (empty state: "Upload your first document")

6. **Knowledge graph page** (`pages/graph.js`):
   - Combine `knowledge_graph_animation_1` (Three.js scene) + `knowledge_graph_animation_2` (UI shell)
   - Left sidebar: cluster list with color dots, node list
   - Center: Three.js 3D graph visualization using `three-neural.js` base, but with dynamic nodes/edges
   - Fetch full graph via `api.get('/graph')`
   - Render nodes as spheres, edges as lines in Three.js
   - Node hover: show detail panel (title, content, type)
   - Add node/cluster/edge buttons → open modal forms
   - Filter by cluster, search by title

7. **Learning hub page** (`pages/learn.js`):
   - Extract from `pke_neural_learning_hub/code.html`
   - Course cards: fetch from `api.get('/learning-paths')`
   - Click card → load flashcards, show flashcard flip UI
   - Flashcard flip: reuse existing CSS animation from prototype
   - Progress bar: update via `api.patch('/flashcards/:id/review')`
   - Create new path button → modal with title/category inputs
   - Add flashcard button → modal with question/answer/difficulty

8. **Per-page CSS files** — Extract page-specific styles (animations, keyframes, layout) from the original HTML files into dedicated CSS files to reduce duplication.

---

### Phase 6: Polish & Production

**Steps:**

1. **Error handling:**
   - API routes: wrap in try/catch, return `{error: message}` with appropriate status codes
   - Frontend: `api.js` handles network errors, shows toast notifications
   - Global error boundary in `app.js`

2. **Loading states:**
   - Each page's `render()` includes skeleton/shimmer placeholders
   - `mount()` replaces skeletons with real content after fetch completes
   - Three.js pages show CSS spinner until canvas is ready

3. **Responsive design:**
   - Sidebar collapses to hamburger on mobile (from `knowledge_graph_animation_2` pattern)
   - Landing page hero stacks vertically on small screens
   - Chat interface: full-width on mobile, sidebar hidden

4. **Environment configuration:**
   - `.env` file for `PORT`, `JWT_SECRET`, `OPENAI_API_KEY`
   - `.env.example` committed to repo
   - Database file path configurable

5. **Seed data** (optional):
   - `server/db/seed.js` script to populate demo data
   - Creates a demo user, some sample documents, chat history, learning paths with flashcards, and a knowledge graph
   - Run with `npm run seed`

---

## Execution Order (Build Sequence)

| Step | Phase | What | Depends On |
|------|-------|------|------------|
| 1 | 1 | Create `server/package.json` + run `npm install` | — |
| 2 | 1 | Create `server/db/schema.sql` + `server/db/database.js` | Step 1 |
| 3 | 1 | Create `server/index.js` (minimal, static serving only) | Step 1 |
| 4 | 1 | Create `public/index.html` SPA shell | — |
| 5 | 1 | Create `public/js/router.js` | Step 4 |
| 6 | 1 | Create `public/js/api.js` + `public/js/auth.js` | — |
| 7 | 1 | Create `public/js/app.js` (bootstrap) | Steps 5, 6 |
| 8 | 1 | Create `public/css/shared.css` (extracted design tokens) | — |
| 9 | 2 | Create `server/middleware/auth.js` | Steps 1, 2 |
| 10 | 2 | Create `server/routes/auth.js` | Steps 2, 9 |
| 11 | 2 | Create `server/routes/documents.js` + `server/services/extract.js` | Steps 2, 9 |
| 12 | 3 | Create `server/services/search.js` (TF-IDF) | Step 2 |
| 13 | 3 | Create `server/services/llm.js` | — |
| 14 | 3 | Create `server/routes/chats.js` | Steps 2, 9, 12, 13 |
| 15 | 4 | Create `server/routes/learning.js` | Steps 2, 9 |
| 16 | 4 | Create `server/routes/graph.js` | Steps 2, 9 |
| 17 | 5 | Extract `components/sidebar.js` + `components/header.js` | Step 8 |
| 18 | 5 | Extract `components/three-crystal.js` + `components/three-neural.js` | Step 8 |
| 19 | 5 | Build `pages/landing.js` + `pages/login.js` + `pages/signup.js` | Steps 7, 10 |
| 20 | 5 | Build `pages/dashboard.js` | Steps 7, 14, 18 |
| 21 | 5 | Build `pages/graph.js` | Steps 7, 16, 18 |
| 22 | 5 | Build `pages/learn.js` | Steps 7, 15 |
| 23 | 6 | Wire all routes in `server/index.js` | Steps 10-16 |
| 24 | 6 | Error handling + loading states | Steps 19-22 |
| 25 | 6 | Responsive polish | Steps 19-22 |
| 26 | 6 | Optional: seed data script | Steps 2, 11-16 |

---

## Frontend-to-Backend Mapping

Each prototype HTML file maps to specific frontend output:

| Prototype Source | Target File(s) | What Gets Extracted |
|-----------------|----------------|---------------------|
| `pke_landing_page_refined/code.html` | `pages/landing.js`, `pages/signup.js` | Full landing HTML, hero, features, footer. Login CTA → `#/login` |
| `pke_secure_access/code.html` | `pages/login.js` | Login form, mesh gradient BG, SSO buttons (mock), form validation |
| `pke_personal_knowledge_engine_2/code.html` | (deleted — duplicate of secure_access) | — |
| `pke_dashboard/code.html` | `pages/dashboard.js`, `components/three-crystal.js`, `components/sidebar.js` | Sidebar nav, chat UI, Three.js crystal, suggestion chips |
| `knowledge_graph_animation_1/code.html` | `components/three-crystal.js` (graph variant) | Three.js scene with 24 nodes, connections, particle field |
| `knowledge_graph_animation_2/code.html` | `pages/graph.js`, `components/sidebar.js` | Full app shell: top bar, sidebar, canvas area, drawers, filters |
| `pke_neural_learning_hub/code.html` | `pages/learn.js` | Course cards, flashcard flip UI, progress bars, activity stats |
| `three.js_1/code.html` | `components/three-crystal.js` | Standalone crystal animation |
| `three.js_2/code.html` | `components/three-neural.js` | Standalone neural core animation |
| `pke_cosmic_intelligence_landing_page/code.html` | (not used — duplicate of landing_page_refined) | — |
| `pke_interactive_lab_landing_page/code.html` | (not used — too complex for MVP, best features merged into landing) | Particle canvas could be added later |
| `pke_personal_knowledge_engine_1/code.html` | (not used — duplicate of landing_page_refined) | — |

---

## Testing Strategy

1. **Manual API testing**: Use curl or Postman to hit API endpoints after each route is built
2. **Manual browser testing**: Navigate through all pages, verify routing, auth flow, chat flow
3. **Quick smoke test script** (`server/test-smoke.sh`):
   - Register user → login → upload doc → create chat → send message → create learning path → add flashcard → create graph node
4. **No automated test framework for MVP** — too much overhead for prototype conversion

---

## Environment Variables

```env
# .env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=          # Leave empty to use mock LLM
UPLOAD_DIR=./uploads
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Tailwind CDN is slow / not production-ready | Acceptable for MVP; migrate to build-time Tailwind in v2 |
| Three.js animations may lag on low-end devices | Add a `prefers-reduced-motion` media query to disable animations |
| TF-IDF search quality is poor | Document this as "basic search"; plan to add embeddings in v2 |
| All images are hosted on Google CDN | Download critical images to `public/assets/` during build |
| Single-file HTML extraction is error-prone | Use the explore report's line counts to guide extraction; test each page individually |
