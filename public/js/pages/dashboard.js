import { api } from '../api.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';
import { initCrystal, disposeCrystal } from '../components/three-crystal.js';

let currentChatId = null;
let chats = [];

export default {
    render() {
        return `
        ${renderSidebar('dashboard')}
        ${renderHeader('PKE Engine')}
        <main class="ml-[280px] mt-16 h-[calc(100vh-64px)] flex flex-col">
            <div id="chat-messages" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4"></div>
            <div id="empty-state" class="flex-1 flex flex-col items-center justify-center px-6">
                <div id="threejs-container" class="w-64 h-64 mb-6"></div>
                <div class="core-glow absolute w-64 h-64 rounded-full opacity-50"></div>
                <h2 class="font-display font-bold text-2xl mb-2 animate-fade-up">Ask anything about <span class="gradient-text">your documents</span></h2>
                <p class="text-on-surface-variant text-sm mb-6 animate-fade-up" style="animation-delay:0.1s">Upload documents and get AI-powered insights</p>
                <div class="flex flex-wrap justify-center gap-3 animate-fade-up" style="animation-delay:0.2s">
                    <button onclick="window._pkeSuggestion('Summarize the key points of my documents')" class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-white/5 text-sm text-on-surface-variant hover:border-primary/30 transition-all">
                        <span class="material-symbols-outlined text-lg">summarize</span> Summarize document
                    </button>
                    <button onclick="window._pkeSuggestion('Find key findings and insights')" class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-white/5 text-sm text-on-surface-variant hover:border-primary/30 transition-all">
                        <span class="material-symbols-outlined text-lg">search_insights</span> Find key findings
                    </button>
                    <button onclick="window._pkeSuggestion('List action items from the documents')" class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-white/5 text-sm text-on-surface-variant hover:border-primary/30 transition-all">
                        <span class="material-symbols-outlined text-lg">task_alt</span> List action items
                    </button>
                </div>
            </div>
            <div class="p-4 border-t border-white/5">
                <div class="gradient-input-border max-w-3xl mx-auto flex items-center gap-2 bg-surface-container/80 rounded-full px-4 py-2">
                    <button class="text-on-surface-variant hover:text-primary transition-colors">
                        <span class="material-symbols-outlined">add_circle</span>
                    </button>
                    <input id="chat-input" type="text" placeholder="Synthesize the core arguments of the PDF..." class="flex-1 bg-transparent text-on-surface outline-none text-sm placeholder-on-surface-variant/50">
                    <span class="text-[10px] text-on-surface-variant/30 font-mono hidden md:block">PRESS Enter</span>
                    <button id="send-btn" class="text-primary hover:brightness-125 transition-all">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
                <p class="text-center text-[10px] text-on-surface-variant/30 font-mono mt-2">PKE v2.4 Engine / Neural Knowledge Graph Protocol v1.9</p>
            </div>
        </main>`;
    },
    async mount() {
        initCrystal('threejs-container');
        await loadDocs();
        await loadChats();
        setupUpload();
        setupChat();
    },
    unmount() {
        disposeCrystal();
    }
};

async function loadDocs() {
    try {
        const docs = await api.get('/documents');
        const el = document.getElementById('doc-list');
        if (!docs.length) {
            el.innerHTML = '<p class="px-3 text-xs text-on-surface-variant/40">No documents yet</p>';
            return;
        }
        el.innerHTML = docs.map(d => `
            <div class="tilt-card px-3 py-2 rounded-lg bg-surface-container/40 border border-white/5 cursor-pointer hover:border-primary/20 transition-all">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-lg">description</span>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs truncate">${d.filename}</p>
                        <p class="text-[10px] text-on-surface-variant/50">${d.page_count || 0} pages</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch {}
}

async function loadChats() {
    try {
        chats = await api.get('/chats');
        const el = document.getElementById('chat-list');
        if (!chats.length) {
            el.innerHTML = '<p class="px-3 text-xs text-on-surface-variant/40">No chats yet</p>';
            return;
        }
        el.innerHTML = chats.slice(0, 5).map(c => `
            <a href="javascript:void(0)" onclick="window._pkeOpenChat(${c.id})" class="block px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface transition-all truncate">
                ${c.title}
            </a>
        `).join('');
    } catch {}
}

window._pkeOpenChat = async (chatId) => {
    currentChatId = chatId;
    const messages = await api.get(`/chats/${chatId}/messages`);
    const container = document.getElementById('chat-messages');
    const empty = document.getElementById('empty-state');
    if (empty) empty.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML = messages.map(m => msgHTML(m.role, m.content)).join('');
    container.scrollTop = container.scrollHeight;
};

window._pkeSuggestion = (text) => {
    const input = document.getElementById('chat-input');
    input.value = text;
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
};

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function msgHTML(role, content) {
    const isUser = role === 'user';
    const safe = escapeHTML(content).replace(/\n/g, '<br>');
    return `
    <div class="flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-up">
        <div class="${isUser ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container-high/50 border border-white/5'} max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed">
            ${safe}
        </div>
    </div>`;
}

function setupChat() {
    const input = document.getElementById('chat-input');
    const send = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        sendChatMessage(text);
    };
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
    document.getElementById('send-btn').addEventListener('click', send);
}

async function sendChatMessage(content) {
    const container = document.getElementById('chat-messages');
    const empty = document.getElementById('empty-state');
    if (empty) empty.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML += msgHTML('user', content);
    container.innerHTML += `<div id="loading-msg" class="flex justify-start animate-fade-up"><div class="bg-surface-container-high/50 border border-white/5 px-4 py-3 rounded-2xl text-sm"><span class="material-symbols-outlined animate-spin text-primary">progress_activity</span></div></div>`;
    container.scrollTop = container.scrollHeight;

    try {
        if (!currentChatId) {
            const chat = await api.post('/chats', { title: content.substring(0, 50) });
            currentChatId = chat.id;
        }
        const { user_msg, assistant_msg } = await api.post(`/chats/${currentChatId}/messages`, { content });
        document.getElementById('loading-msg')?.remove();
        container.innerHTML += msgHTML('assistant', assistant_msg.content);
        container.scrollTop = container.scrollHeight;
        loadChats();
    } catch (err) {
        document.getElementById('loading-msg')?.remove();
        container.innerHTML += msgHTML('assistant', 'Sorry, an error occurred. Please try again.');
    }
}


