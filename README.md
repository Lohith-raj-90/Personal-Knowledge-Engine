<div align="center">

<!-- Shields / Badges -->
<a href="https://github.com/Lohith-raj-90/s-pke_final/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/Lohith-raj-90/s-pke_final?style=for-the-badge&color=blue" alt="License">
</a>
<img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge&color=green" alt="Version">
<img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/express-4.21-white?style=for-the-badge&logo=express&logoColor=black" alt="Express">
<img src="https://img.shields.io/badge/three.js-r128-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js">
<img src="https://img.shields.io/badge/tailwindcss-CDN-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<br>
<img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status">
<img src="https://img.shields.io/badge/prs-welcome-orange?style=for-the-badge" alt="PRs Welcome">
<img src="https://img.shields.io/badge/made%20with-%E2%9D%A4-red?style=for-the-badge" alt="Made with love">

<br><br>

<!-- Project Logo / Hero Image -->
<img src="https://via.placeholder.com/900x300/101419/4f9eff?text=PKE+-+Personal+Knowledge+Engine" width="90%" alt="PKE Banner">

<br><br>

# **PKE** — Personal Knowledge Engine

### *Your Knowledge, Supercharged.*

A **private, self-hosted RAG platform** that transforms documents into interconnected intelligence.
Chat with AI, build knowledge graphs, and master concepts — all on your own infrastructure.

<br>

[**Get Started**](#-installation) · [**Features**](#-features) · [**Documentation**](#-usage) · [**Contact**](#-contact-developer)

<br>

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Contact Developer](#-contact-developer)
- [License](#-license)

---

## 🔍 About

**PKE (Personal Knowledge Engine)** is a full-stack web application designed for researchers, engineers, and teams who need to extract meaningful insights from large document collections. Unlike cloud-based solutions, PKE runs entirely on your own machine — your data never leaves your infrastructure.

PKE combines **Retrieval-Augmented Generation (RAG)** with **interactive knowledge visualization** to help you:

- Upload and index documents (PDF, DOCX, TXT)
- Chat with an AI assistant grounded in your documents
- Visualize concept relationships as interactive 3D knowledge graphs
- Generate flashcards and structured learning paths

Whether you're a solo researcher managing papers or a team building a shared knowledge base, PKE gives you **intelligent document understanding** without compromising privacy.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI Chat & RAG
- Natural language queries against your documents
- Context-aware responses with source attribution
- OpenAI integration with **mock fallback** (works without API key)
- Chat history with full message persistence

</td>
<td width="50%" valign="top">

### 🕸️ Knowledge Graphs
- Interactive **3D graph visualization** (Three.js)
- Create clusters, nodes, and relationship edges
- Multiple edge types: related, depends_on, part_of, contradicts, supports
- Real-time force-directed layout

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📚 Learning Paths
- Auto-generate flashcards from documents
- Track progress with spaced repetition
- Categorized courses (science, math, custom)
- Flip-card review interface

</td>
<td width="50%" valign="top">

### 📄 Document Management
- Upload PDF, DOCX, and TXT files
- Automatic text extraction and indexing
- **TF-IDF search** with cosine similarity
- Per-user document isolation

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication & Security
- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Self-hosted — zero data leakage

</td>
<td width="50%" valign="top">

### 🎨 Immersive UI
- Full-screen **Three.js** particle backgrounds
- Cursor-tracking 3D interactivity
- Scroll-driven animations
- Glass morphism design system
- Responsive across all devices

</td>
</tr>
</table>

---

## 📸 Screenshots

<div align="center">

| Landing Page | Dashboard | Knowledge Graph | Learning Hub |
|:---:|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/400x250/101419/4f9eff?text=Landing+Page" width="100%"> | <img src="https://via.placeholder.com/400x250/101419/cebdff?text=Dashboard" width="100%"> | <img src="https://via.placeholder.com/400x250/101419/a78bfa?text=Knowledge+Graph" width="100%"> | <img src="https://via.placeholder.com/400x250/101419/ffb867?text=Learning+Hub" width="100%"> |

*Replace placeholders with actual screenshots when available.*

</div>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:---|:---|
| **HTML5 / CSS3** | Semantic markup and styling |
| **Tailwind CSS** (CDN) | Utility-first CSS framework |
| **JavaScript ES Modules** | Client-side application logic |
| **Three.js r128** | 3D knowledge graph & landing animations |
| **Material Symbols** | Iconography |
| **Google Fonts** | Sora, Plus Jakarta Sans, JetBrains Mono |

### Backend
| Technology | Purpose |
|:---|:---|
| **Node.js** ≥ 18 | Runtime environment |
| **Express.js** 4.21 | Web framework & API routing |
| **SQLite** (sql.js) | Embedded database |
| **JWT** (jsonwebtoken) | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **pdf-parse** | PDF text extraction |
| **Mammoth** | DOCX text extraction |
| **dotenv** | Environment configuration |

### Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Router  │  │ Three.js │  │   Page Modules    │  │
│  │  (Hash)  │  │  Scenes  │  │  (render/mount)   │  │
│  └────┬─────┘  └──────────┘  └─────────┬─────────┘  │
│       │           │                     │             │
│       └───────────┼─────────────────────┘             │
│                   ▼                                   │
│             ┌──────────┐                              │
│             │  api.js  │ ──► Fetch with JWT            │
│             └────┬─────┘                              │
└──────────────────┼───────────────────────────────────┘
                   │ HTTP
┌──────────────────┼───────────────────────────────────┐
│             ┌────▼─────┐    Server (Express)          │
│             │  Routes  │                              │
│  ┌──────────┼──┬──┬──┬─┴──────────────────────┐      │
│  │ auth   docs chat learn graph               │      │
│  └───┬─────┬───┬───┬───┬──────────────────────┘      │
│      │     │   │   │   │                              │
│      ▼     ▼   ▼   ▼   ▼                              │
│  ┌──────────────────────────┐                         │
│  │      SQLite (sql.js)     │                         │
│  │  users, documents, chats │                         │
│  │  messages, learning,     │                         │
│  │  flashcards, graph       │                         │
│  └──────────────────────────┘                         │
└──────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Lohith-raj-90/s-pke_final.git
cd s-pke_final

# 2. Install server dependencies
cd server
npm install

# 3. Return to project root
cd ..

# 4. (Optional) Seed demo data
cd server
npm run seed
cd ..

# 5. Start the server
cd server
npm start
```

The server starts at **http://localhost:3000**.

### Development Mode

```bash
cd server
npm run dev
```

Uses Node.js `--watch` for automatic restarts on file changes.

---

## 🚀 Usage

### Opening the App

Navigate to `http://localhost:3000` in your browser. You'll see the landing page with an interactive Three.js particle background.

### 1. Create an Account

Click **Get Started** → fill in your name, email, and password → you'll be auto-redirected to the dashboard.

### 2. Upload Documents

From the dashboard sidebar, click the **upload area** or drag-and-drop files:
- Supported formats: **PDF**, **DOCX**, **TXT**
- Documents are automatically text-indexed for search

### 3. Chat with AI

Type a question in the chat input. PKE searches your documents for relevant context and generates a grounded response.

```
You: What are the main findings in the research paper?
AI: Based on the uploaded document "research_paper.pdf", the main findings are:
    1. The proposed method achieves 94.2% accuracy...
    2. Training time was reduced by 3.2x compared to baseline...
```

### 4. Build Knowledge Graphs

Navigate to the **Graph** page:
- Create clusters to organize concepts
- Add nodes (concept, document, person, event, question)
- Connect nodes with typed edges
- Explore the interactive 3D visualization

### 5. Create Learning Paths

Navigate to the **Learn** page:
- Create a learning path with a title and category
- Add flashcards (question, answer, difficulty)
- Review cards with the flip interface
- Track your progress over time

---

## 📡 API Reference

All protected endpoints require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### Documents

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/documents` | List user's documents |
| `POST` | `/api/documents` | Upload a document (multipart) |
| `DELETE` | `/api/documents/:id` | Delete a document |

### Chats

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/chats` | List user's chats |
| `POST` | `/api/chats` | Create a new chat |
| `GET` | `/api/chats/:id/messages` | Get messages for a chat |
| `POST` | `/api/chats/:id/messages` | Send a message, get AI response |

### Learning

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/learning-paths` | List learning paths |
| `POST` | `/api/learning-paths` | Create a learning path |
| `GET` | `/api/learning-paths/:id/flashcards` | List flashcards |
| `POST` | `/api/learning-paths/:id/flashcards` | Add a flashcard |
| `PATCH` | `/api/learning-paths/flashcards/:id/review` | Mark flashcard reviewed |

### Knowledge Graph

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/graph` | Full graph (nodes, edges, clusters) |
| `GET` | `/api/graph/clusters` | List clusters |
| `POST` | `/api/graph/clusters` | Create a cluster |
| `GET` | `/api/graph/nodes` | List nodes |
| `POST` | `/api/graph/nodes` | Create a node |
| `GET` | `/api/graph/edges` | List edges |
| `POST` | `/api/graph/edges` | Create an edge |

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=3000

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# OpenAI (optional — leave empty to use mock LLM)
OPENAI_API_KEY=

# File uploads
UPLOAD_DIR=./uploads
```

> **Note:** If `OPENAI_API_KEY` is empty, PKE returns pre-written mock responses that demonstrate the full UI flow. No external API key is required to run the application.

---

## 📂 Project Structure

```
s-pke_final/
├── server/                          # Backend (Node.js + Express)
│   ├── index.js                     # Express entry point
│   ├── package.json                 # Dependencies
│   ├── db/
│   │   ├── schema.sql               # Database DDL
│   │   ├── database.js              # SQLite connection + helpers
│   │   └── seed.js                  # Demo data seeder
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── routes/
│   │   ├── auth.js                  # Register, login, profile
│   │   ├── documents.js             # Upload, list, delete
│   │   ├── chats.js                 # Chat CRUD + messages
│   │   ├── learning.js              # Paths + flashcards
│   │   └── graph.js                 # Nodes, edges, clusters
│   ├── services/
│   │   ├── extract.js               # PDF/DOCX text extraction
│   │   ├── search.js                # TF-IDF indexing + search
│   │   └── llm.js                   # OpenAI wrapper / mock
│   └── uploads/                     # Uploaded document storage
│
├── public/                          # Frontend (Static SPA)
│   ├── index.html                   # SPA shell + Tailwind config
│   ├── css/
│   │   └── shared.css               # Design tokens + glass classes
│   └── js/
│       ├── app.js                   # Bootstrap + route registration
│       ├── router.js                # Hash-based SPA router
│       ├── api.js                   # Fetch wrapper with JWT
│       ├── auth.js                  # Token storage + auth state
│       ├── components/
│       │   ├── sidebar.js           # Shared sidebar
│       │   ├── header.js            # Shared top bar
│       │   ├── three-crystal.js     # Crystal animation
│       │   ├── three-neural.js      # Neural core animation
│       │   └── three-landing.js     # Landing page 3D scene
│       └── pages/
│           ├── landing.js           # Landing page
│           ├── login.js             # Login page
│           ├── signup.js            # Signup page
│           ├── dashboard.js         # Chat dashboard
│           ├── graph.js             # Knowledge graph
│           └── learn.js             # Learning hub
│
├── stitch_pke_final/                # Original HTML prototypes
├── .env                             # Environment config
├── .env.example                     # Config template
└── IMPLEMENTATION_PLAN.md           # Architecture decisions
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/s-pke_final.git
cd s-pke_final
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow the existing code style (ES modules, single-page architecture)
- Each page module exports `{ render, mount, unmount }`
- Keep Three.js components self-contained in `components/`
- Test your changes by running `npm start`

### 4. Commit & Push

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

Describe your changes, link any related issues, and wait for review.

### Guidelines

- **Code Style:** ES modules, async/await, no semicolons inconsistency
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- **Testing:** Manual testing via browser + API endpoints
- **Security:** Never commit `.env` files or secrets

---

## 👨‍💻 Contact Developer

<div align="center">

**Lohith Raj**

[![Email](https://img.shields.io/badge/Emaillohithraj9090@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lohithraj9090@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHubLohith--raj--90-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lohith-raj-90)

</div>

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 202 Lohith Raj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by [Lohith Raj](https://github.com/Lohith-raj-90)**

*If you found this project helpful, please consider giving it a ⭐*

</div>
