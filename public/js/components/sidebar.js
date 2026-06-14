import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';

export function renderSidebar(activePage) {
    const user = getUser();
    const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    const navItems = [
        { id: 'dashboard', icon: 'chat', label: 'Chat' },
        { id: 'graph', icon: 'hub', label: 'Knowledge Graph' },
        { id: 'learn', icon: 'school', label: 'Learning Hub' },
    ];

    return `
    <aside class="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
        <div class="p-5 border-b border-white/5">
            <div class="flex items-center gap-3 mb-4">
                <span class="material-symbols-outlined filled text-primary text-2xl">hub</span>
                <div>
                    <span class="font-heading font-bold text-lg">PKE</span>
                    <p class="text-[10px] text-on-surface-variant font-mono">Vast Intelligence</p>
                </div>
            </div>
            <button onclick="document.getElementById('upload-modal').classList.remove('hidden')" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20 text-sm text-primary font-medium hover:brightness-110 transition-all">
                <span class="material-symbols-outlined text-lg">upload_file</span>
                Upload Documents
            </button>
        </div>

        <nav class="flex-1 p-3 space-y-1">
            ${navItems.map(item => `
                <a href="#/${item.id}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activePage === item.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface border border-transparent'
                }">
                    <span class="material-symbols-outlined text-xl">${item.icon}</span>
                    ${item.label}
                </a>
            `).join('')}
        </nav>

        <div id="sidebar-documents" class="px-3 pb-2">
            <p class="px-3 text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-2">My Documents</p>
            <div id="doc-list" class="space-y-1"></div>
        </div>

        <div id="sidebar-chats" class="px-3 pb-2">
            <p class="px-3 text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-2">Recent Chats</p>
            <div id="chat-list" class="space-y-1"></div>
        </div>

        <div class="p-4 border-t border-white/5">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">${initials}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">${user?.name || 'User'}</p>
                    <p class="text-[10px] text-on-surface-variant font-mono">Pro Tier v2.4</p>
                </div>
                <button onclick="window._pkeLogout()" class="text-on-surface-variant hover:text-red-400 transition-colors">
                    <span class="material-symbols-outlined text-lg">logout</span>
                </button>
            </div>
        </div>
    </aside>`;
}

window._pkeLogout = () => {
    logout();
    navigate('/login');
};
