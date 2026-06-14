import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';
import { api } from '../api.js';

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
                    <span class="font-display font-bold text-lg">PKE</span>
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
    </aside>
    <div id="upload-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="glass-panel p-8 w-full max-w-lg mx-4">
            <h3 class="font-display font-semibold text-xl mb-4">Upload Documents</h3>
            <div id="drop-zone" class="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-4xl text-on-surface-variant/50 block mb-2">cloud_upload</span>
                <p class="text-on-surface-variant text-sm">Drop files here or click to browse</p>
                <p class="text-on-surface-variant/50 text-xs mt-1">PDF, DOCX, TXT (max 50MB)</p>
                <input type="file" id="file-input" class="hidden" accept=".pdf,.docx,.txt" multiple>
            </div>
            <div id="upload-status" class="mt-4 text-sm text-on-surface-variant hidden"></div>
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="document.getElementById('upload-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high/50">Cancel</button>
                <button id="upload-btn" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-110" disabled>Upload</button>
            </div>
        </div>
    </div>`;
}

export function setupUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const status = document.getElementById('upload-status');
    if (!dropZone || !fileInput || !uploadBtn || !status) return;
    let selectedFiles = [];

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-primary/50'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-primary/50'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary/50');
        selectedFiles = [...e.dataTransfer.files];
        updateUploadUI();
    });
    fileInput.addEventListener('change', () => {
        selectedFiles = [...fileInput.files];
        updateUploadUI();
    });

    function updateUploadUI() {
        status.classList.remove('hidden');
        status.textContent = `${selectedFiles.length} file(s) selected`;
        uploadBtn.disabled = !selectedFiles.length;
    }

    uploadBtn.addEventListener('click', async () => {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        for (const file of selectedFiles) {
            const fd = new FormData();
            fd.append('file', file);
            try {
                await api.upload('/documents', fd);
            } catch {}
        }
        selectedFiles = [];
        document.getElementById('upload-modal').classList.add('hidden');
        uploadBtn.textContent = 'Upload';
        status.classList.add('hidden');
        window.showToast('Documents uploaded successfully', 'success');
    });
}

window._pkeLogout = () => {
    logout();
    navigate('/login');
};
