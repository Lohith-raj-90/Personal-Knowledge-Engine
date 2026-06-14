export function renderHeader(title = 'PKE') {
    return `
    <header class="fixed top-0 left-[280px] right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
        <h1 class="font-display font-semibold text-lg">${title}</h1>
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-xs text-green-400 font-mono">GPT-4o ACTIVE</span>
            </div>
            <button class="p-2 rounded-lg hover:bg-surface-container-high/50 text-on-surface-variant transition-colors">
                <span class="material-symbols-outlined">settings</span>
            </button>
        </div>
    </header>`;
}
