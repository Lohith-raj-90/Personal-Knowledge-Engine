import { api } from '../api.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';
import { initNeural, disposeNeural } from '../components/three-neural.js';

let graphData = { nodes: [], edges: [], clusters: [] };

export default {
    render() {
        return `
        ${renderSidebar('graph')}
        ${renderHeader('Knowledge Graph')}
        <main class="ml-[280px] mt-16 h-[calc(100vh-64px)] relative overflow-hidden">
            <div id="graph-canvas" class="absolute inset-0 z-0"></div>
            <div class="absolute left-4 top-4 w-72 z-10 space-y-3">
                <div class="crystalline-glass rounded-xl p-4">
                    <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-2">Search</p>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">search</span>
                        <input id="graph-search" type="text" placeholder="Filter nodes..." class="w-full pl-9 pr-3 py-2 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none focus:border-primary/30">
                    </div>
                </div>
                <div class="crystalline-glass rounded-xl p-4">
                    <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider mb-3">Engine Stats</p>
                    <div class="grid grid-cols-3 gap-3 text-center">
                        <div><p class="text-xl font-heading font-bold text-primary" id="stat-nodes">0</p><p class="text-[10px] text-on-surface-variant/50">Nodes</p></div>
                        <div><p class="text-xl font-heading font-bold text-secondary" id="stat-edges">0</p><p class="text-[10px] text-on-surface-variant/50">Links</p></div>
                        <div><p class="text-xl font-heading font-bold text-tertiary" id="stat-clusters">0</p><p class="text-[10px] text-on-surface-variant/50">Clusters</p></div>
                    </div>
                </div>
                <div class="crystalline-glass rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider">Active Clusters</p>
                        <button onclick="document.getElementById('cluster-modal').classList.remove('hidden')" class="text-primary hover:brightness-125"><span class="material-symbols-outlined text-lg">add</span></button>
                    </div>
                    <div id="cluster-list" class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar"></div>
                </div>
            </div>
            <div id="node-detail" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 crystalline-glass rounded-xl p-4 max-w-2xl hidden">
                <div class="flex items-start gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary">Document Node</span>
                            <span class="text-[10px] font-mono text-on-surface-variant/40" id="detail-id"></span>
                        </div>
                        <h3 class="font-heading font-semibold" id="detail-title"></h3>
                        <p class="text-sm text-on-surface-variant mt-1" id="detail-content"></p>
                    </div>
                    <button onclick="document.getElementById('node-detail').classList.add('hidden')" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
                </div>
            </div>
            <button onclick="document.getElementById('node-modal').classList.remove('hidden')" class="absolute right-4 bottom-4 z-10 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
                <span class="material-symbols-outlined">add</span>
            </button>
            <div id="cluster-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div class="glass-panel p-8 w-full max-w-md mx-4">
                    <h3 class="font-heading font-semibold text-xl mb-4">New Cluster</h3>
                    <input id="cluster-name" type="text" placeholder="Cluster name" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3">
                    <input id="cluster-color" type="color" value="#4f9eff" class="w-full h-10 rounded-lg cursor-pointer mb-4">
                    <div class="flex justify-end gap-3">
                        <button onclick="document.getElementById('cluster-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg text-sm text-on-surface-variant">Cancel</button>
                        <button onclick="window._pkeCreateCluster()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Create</button>
                    </div>
                </div>
            </div>
            <div id="node-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div class="glass-panel p-8 w-full max-w-md mx-4">
                    <h3 class="font-heading font-semibold text-xl mb-4">New Node</h3>
                    <input id="node-title" type="text" placeholder="Node title" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3">
                    <textarea id="node-content" placeholder="Content" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3 h-24 resize-none"></textarea>
                    <select id="node-type" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-3">
                        <option value="concept">Concept</option>
                        <option value="document">Document</option>
                        <option value="person">Person</option>
                        <option value="event">Event</option>
                        <option value="question">Question</option>
                    </select>
                    <select id="node-cluster" class="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-lg text-sm outline-none mb-4">
                        <option value="">No cluster</option>
                    </select>
                    <div class="flex justify-end gap-3">
                        <button onclick="document.getElementById('node-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg text-sm text-on-surface-variant">Cancel</button>
                        <button onclick="window._pkeCreateNode()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Create</button>
                    </div>
                </div>
            </div>
        </main>`;
    },
    async mount() {
        await loadGraph();
        initNeural('graph-canvas', graphData);
        document.getElementById('graph-search').addEventListener('input', (e) => filterNodes(e.target.value));
    },
    unmount() {
        disposeNeural();
    }
};

async function loadGraph() {
    try {
        graphData = await api.get('/graph');
        document.getElementById('stat-nodes').textContent = graphData.nodes.length;
        document.getElementById('stat-edges').textContent = graphData.edges.length;
        document.getElementById('stat-clusters').textContent = graphData.clusters.length;

        const clusterList = document.getElementById('cluster-list');
        clusterList.innerHTML = graphData.clusters.map(c => `
            <div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container-high/30 cursor-pointer transition-all" onclick="window._pkeSelectCluster(${c.id})">
                <span class="w-3 h-3 rounded-full" style="background:${c.color}"></span>
                <div class="flex-1 min-w-0">
                    <p class="text-xs truncate">${c.name}</p>
                    <p class="text-[10px] text-on-surface-variant/50">${c.node_count} nodes</p>
                </div>
            </div>
        `).join('');

        const select = document.getElementById('node-cluster');
        select.innerHTML = '<option value="">No cluster</option>' + graphData.clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch {}
}

function filterNodes(query) {
    const nodes = document.querySelectorAll('#graph-canvas .node-label');
    // Simple text filter on visible labels
}

window._pkeSelectCluster = (id) => {
    const cluster = graphData.clusters.find(c => c.id === id);
    if (!cluster) return;
    const detail = document.getElementById('node-detail');
    detail.classList.remove('hidden');
    document.getElementById('detail-id').textContent = `Cluster: ${cluster.name}`;
    document.getElementById('detail-title').textContent = cluster.name;
    document.getElementById('detail-content').textContent = `${cluster.node_count} nodes attached`;
};

window._pkeCreateCluster = async () => {
    const name = document.getElementById('cluster-name').value.trim();
    const color = document.getElementById('cluster-color').value;
    if (!name) return;
    try {
        await api.post('/graph/clusters', { name, color });
        document.getElementById('cluster-modal').classList.add('hidden');
        document.getElementById('cluster-name').value = '';
        loadGraph();
        disposeNeural();
        initNeural('graph-canvas', graphData);
        window.showToast('Cluster created', 'success');
    } catch (err) {
        window.showToast(err.message, 'error');
    }
};

window._pkeCreateNode = async () => {
    const title = document.getElementById('node-title').value.trim();
    const content = document.getElementById('node-content').value.trim();
    const node_type = document.getElementById('node-type').value;
    const cluster_id = document.getElementById('node-cluster').value || null;
    if (!title) return;
    try {
        await api.post('/graph/nodes', { title, content, node_type, cluster_id: cluster_id ? parseInt(cluster_id) : null });
        document.getElementById('node-modal').classList.add('hidden');
        document.getElementById('node-title').value = '';
        document.getElementById('node-content').value = '';
        loadGraph();
        disposeNeural();
        initNeural('graph-canvas', graphData);
        window.showToast('Node created', 'success');
    } catch (err) {
        window.showToast(err.message, 'error');
    }
};
