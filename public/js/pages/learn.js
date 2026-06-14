import { api } from '../api.js';
import { renderSidebar } from '../components/sidebar.js';

let paths = [];
let activePathId = null;
let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

export default {
    render() {
        return `
        ${renderSidebar('learn')}
        <main class="ml-[280px] h-screen flex flex-col overflow-hidden">
            <header class="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-xl">
                <h1 class="font-heading font-semibold text-lg">Learning Hub</h1>
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">search</span>
                        <input type="text" placeholder="Search learning paths..." class="pl-9 pr-3 py-2 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none w-64 focus:border-primary/30">
                    </div>
                    <button class="p-2 rounded-lg hover:bg-surface-container-high/50 text-on-surface-variant"><span class="material-symbols-outlined">notifications</span></button>
                    <button class="p-2 rounded-lg hover:bg-surface-container-high/50 text-on-surface-variant"><span class="material-symbols-outlined">settings</span></button>
                </div>
            </header>
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <div class="core-glow h-40 flex items-center px-8">
                    <div>
                        <h2 class="font-heading font-bold text-3xl mb-1">Learning Hub</h2>
                        <p class="text-on-surface-variant text-sm">Master concepts through structured learning paths and spaced repetition.</p>
                    </div>
                </div>
                <div class="px-8 pb-8 space-y-8">
                    <section>
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-heading font-semibold text-lg">Learning Paths</h3>
                            <button onclick="document.getElementById('path-modal').classList.remove('hidden')" class="text-primary text-sm hover:underline">+ Create Path</button>
                        </div>
                        <div id="paths-grid" class="grid md:grid-cols-3 gap-4"></div>
                    </section>
                    <section>
                        <h3 class="font-heading font-semibold text-lg mb-4">Deep Work Tools</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="glass-card p-6">
                                <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-2">Flashcard Engine</p>
                                <div id="flashcard-area" class="min-h-[200px] flex items-center justify-center">
                                    <p class="text-on-surface-variant/40 text-sm">Select a learning path to start reviewing</p>
                                </div>
                            </div>
                            <div class="glass-card p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider">Concept Map</p>
                                    <div class="flex gap-1">
                                        <button class="p-1 rounded hover:bg-surface-container-high/50 text-on-surface-variant"><span class="material-symbols-outlined text-lg">zoom_in</span></button>
                                        <button class="p-1 rounded hover:bg-surface-container-high/50 text-on-surface-variant"><span class="material-symbols-outlined text-lg">zoom_out</span></button>
                                    </div>
                                </div>
                                <div class="flex items-center justify-center h-48 relative">
                                    <div class="absolute w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span class="text-xs font-heading font-semibold text-primary text-center">Quantum<br>State</span>
                                    </div>
                                    <div class="absolute top-2 left-1/4 px-2 py-1 rounded bg-surface-container-high/80 text-[10px] text-on-surface-variant">Superposition</div>
                                    <div class="absolute top-2 right-1/4 px-2 py-1 rounded bg-surface-container-high/80 text-[10px] text-on-surface-variant">Entanglement</div>
                                    <div class="absolute bottom-2 left-1/4 px-2 py-1 rounded bg-surface-container-high/80 text-[10px] text-on-surface-variant">Wave Function</div>
                                    <div class="absolute bottom-2 right-1/4 px-2 py-1 rounded bg-surface-container-high/80 text-[10px] text-on-surface-variant">Probability</div>
                                    <svg class="absolute inset-0 w-full h-full" style="pointer-events:none">
                                        <line x1="50%" y1="50%" x2="25%" y2="12%" stroke="#4f9eff" stroke-opacity="0.2" stroke-width="1"/>
                                        <line x1="50%" y1="50%" x2="75%" y2="12%" stroke="#4f9eff" stroke-opacity="0.2" stroke-width="1"/>
                                        <line x1="50%" y1="50%" x2="25%" y2="88%" stroke="#4f9eff" stroke-opacity="0.2" stroke-width="1"/>
                                        <line x1="50%" y1="50%" x2="75%" y2="88%" stroke="#4f9eff" stroke-opacity="0.2" stroke-width="1"/>
                                    </svg>
                                </div>
                                <p class="text-center text-[10px] text-on-surface-variant/40 font-mono mt-2">Interactive Visualizer v2.4</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 class="font-heading font-semibold text-lg mb-4">Your Stats</h3>
                        <div class="grid md:grid-cols-3 gap-4" id="stats-grid">
                            <div class="glass-card p-5">
                                <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-1">Total Learning Paths</p>
                                <p class="text-2xl font-heading font-bold text-primary" id="stat-paths">0</p>
                                <p class="text-xs text-on-surface-variant/50 mt-1">Active paths</p>
                            </div>
                            <div class="glass-card p-5">
                                <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-1">Total Flashcards</p>
                                <p class="text-2xl font-heading font-bold text-secondary" id="stat-cards">0</p>
                                <p class="text-xs text-on-surface-variant/50 mt-1">Across all paths</p>
                            </div>
                            <div class="glass-card p-5">
                                <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-1">Avg. Progress</p>
                                <p class="text-2xl font-heading font-bold text-tertiary" id="stat-progress">0%</p>
                                <p class="text-xs text-on-surface-variant/50 mt-1">Completion rate</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
        <div id="path-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="glass-panel p-8 w-full max-w-md mx-4">
                <h3 class="font-heading font-semibold text-xl mb-4">New Learning Path</h3>
                <input id="path-title" type="text" placeholder="Path title" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3">
                <select id="path-category" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-4">
                    <option value="general">General</option>
                    <option value="physics">Physics</option>
                    <option value="legal">Legal</option>
                    <option value="cs">Computer Science</option>
                    <option value="math">Mathematics</option>
                </select>
                <div class="flex justify-end gap-3">
                    <button onclick="document.getElementById('path-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg text-sm text-on-surface-variant">Cancel</button>
                    <button onclick="window._pkeCreatePath()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Create</button>
                </div>
            </div>
        </div>
        <div id="flashcard-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="glass-panel p-8 w-full max-w-lg mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-heading font-semibold text-xl">Add Flashcard</h3>
                    <button onclick="document.getElementById('flashcard-modal').classList.add('hidden')" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
                </div>
                <textarea id="fc-question" placeholder="Question" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3 h-20 resize-none"></textarea>
                <textarea id="fc-answer" placeholder="Answer" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3 h-20 resize-none"></textarea>
                <select id="fc-difficulty" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-4">
                    <option value="easy">Easy</option>
                    <option value="medium" selected>Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <div class="flex justify-end gap-3">
                    <button onclick="document.getElementById('flashcard-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg text-sm text-on-surface-variant">Cancel</button>
                    <button onclick="window._pkeAddFlashcard()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Add</button>
                </div>
            </div>
        </div>`;
    },
    async mount() {
        await loadPaths();
        await loadStats();
    },
    unmount() {}
};

async function loadStats() {
    try {
        const totalCards = paths.reduce((sum, p) => sum + (p.flashcard_count || 0), 0);
        const avgProgress = paths.length > 0
            ? Math.round(paths.reduce((sum, p) => sum + p.progress, 0) / paths.length)
            : 0;
        const pathsEl = document.getElementById('stat-paths');
        const cardsEl = document.getElementById('stat-cards');
        const progressEl = document.getElementById('stat-progress');
        if (pathsEl) pathsEl.textContent = paths.length;
        if (cardsEl) cardsEl.textContent = totalCards;
        if (progressEl) progressEl.textContent = avgProgress + '%';
    } catch {}
}

async function loadPaths() {
    try {
        paths = await api.get('/learning-paths');
        const grid = document.getElementById('paths-grid');
        grid.innerHTML = paths.map(p => `
            <div class="glass-card p-5 cursor-pointer hover:border-primary/30 transition-all" onclick="window._pkeSelectPath(${p.id})">
                <div class="flex items-center justify-between mb-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary">${p.category}</span>
                    <span class="text-[10px] text-on-surface-variant/50">${p.flashcard_count} cards</span>
                </div>
                <h4 class="font-heading font-semibold mb-2">${p.title}</h4>
                <div class="w-full bg-surface-container-high/50 rounded-full h-1.5">
                    <div class="bg-primary rounded-full h-1.5 transition-all" style="width:${p.progress}%"></div>
                </div>
                <p class="text-[10px] text-on-surface-variant/50 mt-1">${p.progress}% complete</p>
            </div>
        `).join('') + `
            <div class="glass-card p-5 border-dashed cursor-pointer hover:border-primary/30 transition-all flex flex-col items-center justify-center min-h-[140px]" onclick="document.getElementById('path-modal').classList.remove('hidden')">
                <span class="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2">add</span>
                <p class="text-sm text-on-surface-variant/50">Create New Path</p>
            </div>`;
    } catch {}
}

window._pkeSelectPath = async (id) => {
    activePathId = id;
    try {
        flashcards = await api.get(`/learning-paths/${id}/flashcards`);
        currentCardIndex = 0;
        isFlipped = false;
        renderFlashcard();
        document.getElementById('flashcard-area').innerHTML += `<button onclick="document.getElementById('flashcard-modal').classList.remove('hidden')" class="mt-3 text-primary text-xs hover:underline">+ Add Flashcard</button>`;
    } catch {}
};

function renderFlashcard() {
    const area = document.getElementById('flashcard-area');
    if (!flashcards.length) {
        area.innerHTML = '<p class="text-on-surface-variant/40 text-sm">No flashcards yet. Add one to get started.</p><button onclick="document.getElementById(\'flashcard-modal\').classList.remove(\'hidden\')" class="mt-3 text-primary text-xs hover:underline">+ Add Flashcard</button>';
        return;
    }
    const card = flashcards[currentCardIndex];
    area.innerHTML = `
        <div id="fc-box" class="w-full cursor-pointer" style="perspective:1000px" onclick="window._pkeFlipCard()">
            <div id="fc-inner" class="relative w-full min-h-[160px] transition-all duration-500" style="transform-style:preserve-3d;transform:rotateY(0deg)">
                <div class="absolute inset-0 flex items-center justify-center p-6 bg-surface-container/60 border border-white/10 rounded-xl" style="backface-visibility:hidden">
                    <p class="text-center text-sm">${card.question}</p>
                </div>
                <div class="absolute inset-0 flex items-center justify-center p-6 bg-primary/5 border border-primary/20 rounded-xl" style="backface-visibility:hidden;transform:rotateY(180deg)">
                    <p class="text-center text-sm text-primary">${card.answer}</p>
                </div>
            </div>
        </div>
        <p class="text-center text-[10px] text-on-surface-variant/40 mt-2">Click to flip</p>
        <div class="flex justify-center gap-2 mt-3">
            <button onclick="window._pkeRateCard('hard')" class="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs border border-red-500/20 hover:brightness-110">Hard</button>
            <button onclick="window._pkeRateCard('medium')" class="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs border border-yellow-500/20 hover:brightness-110">Good</button>
            <button onclick="window._pkeRateCard('easy')" class="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs border border-green-500/20 hover:brightness-110">Easy</button>
        </div>
        <p class="text-center text-[10px] text-on-surface-variant/30 mt-2">${flashcards.length - currentCardIndex - 1} Cards Pending</p>`;
}

window._pkeFlipCard = () => {
    isFlipped = !isFlipped;
    const inner = document.getElementById('fc-inner');
    if (inner) inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
};

window._pkeRateCard = async (difficulty) => {
    const card = flashcards[currentCardIndex];
    try {
        await api.patch(`/flashcards/${card.id}/review`, { difficulty });
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        isFlipped = false;
        renderFlashcard();
        loadPaths();
    } catch {}
};

window._pkeCreatePath = async () => {
    const title = document.getElementById('path-title').value.trim();
    const category = document.getElementById('path-category').value;
    if (!title) return;
    try {
        await api.post('/learning-paths', { title, category });
        document.getElementById('path-modal').classList.add('hidden');
        document.getElementById('path-title').value = '';
        loadPaths();
        window.showToast('Learning path created', 'success');
    } catch (err) {
        window.showToast(err.message, 'error');
    }
};

window._pkeAddFlashcard = async () => {
    const question = document.getElementById('fc-question').value.trim();
    const answer = document.getElementById('fc-answer').value.trim();
    const difficulty = document.getElementById('fc-difficulty').value;
    if (!question || !answer || !activePathId) return;
    try {
        await api.post(`/learning-paths/${activePathId}/flashcards`, { question, answer, difficulty });
        document.getElementById('flashcard-modal').classList.add('hidden');
        document.getElementById('fc-question').value = '';
        document.getElementById('fc-answer').value = '';
        flashcards = await api.get(`/learning-paths/${activePathId}/flashcards`);
        renderFlashcard();
        loadPaths();
        window.showToast('Flashcard added', 'success');
    } catch (err) {
        window.showToast(err.message, 'error');
    }
};
