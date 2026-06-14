import { navigate } from '../router.js';
import { isAuthenticated } from '../auth.js';

export default {
    render() {
        return `
        <div class="grain-overlay"></div>
        <nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined filled text-primary text-3xl">hub</span>
                    <span class="font-heading font-bold text-xl">PKE</span>
                </div>
                <div class="hidden md:flex items-center gap-8 text-sm text-on-surface-variant">
                    <a href="#features" class="hover:text-on-surface transition-colors">Features</a>
                    <a href="#showcase" class="hover:text-on-surface transition-colors">Showcase</a>
                    <a href="#" class="hover:text-on-surface transition-colors">Pricing</a>
                </div>
                <button onclick="window.location.hash='${isAuthenticated() ? '/dashboard' : '/login'}'" class="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-all">
                    ${isAuthenticated() ? 'Dashboard' : 'Login'}
                </button>
            </div>
        </nav>

        <section class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
            <div class="core-glow absolute inset-0"></div>
            <div class="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-up">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-white/5 mb-8 text-xs text-on-surface-variant">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    The Future of Intelligence
                </div>
                <h1 class="font-heading font-bold text-5xl md:text-7xl mb-6 text-glow">PKE</h1>
                <p class="text-xl md:text-2xl text-on-surface-variant mb-4 max-w-2xl mx-auto">Your Knowledge, Supercharged</p>
                <p class="text-base text-on-surface-variant/70 mb-10 max-w-xl mx-auto">
                    A private, self-hosted RAG platform for researchers, engineers, and teams. Upload documents, chat with AI, build knowledge graphs, and master concepts.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4">
                    <button onclick="window.location.hash='/signup'" class="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/25">
                        Get Started Free
                    </button>
                    <button class="px-8 py-3 rounded-full bg-surface-container-high/60 border border-white/10 text-on-surface-variant font-medium hover:brightness-110 transition-all">
                        Watch Demo
                    </button>
                </div>
            </div>
            <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float opacity-50">
                <span class="material-symbols-outlined text-4xl text-on-surface-variant/30">expand_more</span>
            </div>
        </section>

        <section id="features" class="py-24 px-6">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16 animate-fade-up">
                    <h2 class="font-heading font-bold text-3xl md:text-4xl mb-4">Intelligent Features</h2>
                    <p class="text-on-surface-variant max-w-xl mx-auto">Everything you need to transform raw documents into actionable knowledge.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="glass-card p-8 tilt-card cursor-default">
                        <span class="material-symbols-outlined text-primary text-3xl mb-4 block">hub</span>
                        <h3 class="font-heading font-semibold text-lg mb-2">Infinite Connections</h3>
                        <p class="text-on-surface-variant text-sm">Automatically discover relationships between concepts across your entire document library.</p>
                    </div>
                    <div class="glass-card p-8 tilt-card cursor-default">
                        <span class="material-symbols-outlined text-secondary text-3xl mb-4 block">groups</span>
                        <h3 class="font-heading font-semibold text-lg mb-2">Team Collaboration</h3>
                        <p class="text-on-surface-variant text-sm">Share knowledge graphs and learning paths with your team for collective intelligence.</p>
                    </div>
                    <div class="glass-card p-8 tilt-card cursor-default">
                        <span class="material-symbols-outlined text-tertiary text-3xl mb-4 block">shield</span>
                        <h3 class="font-heading font-semibold text-lg mb-2">Secure Intelligence</h3>
                        <p class="text-on-surface-variant text-sm">Self-hosted, end-to-end encrypted. Your knowledge stays on your infrastructure.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="showcase" class="py-24 px-6">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="font-heading font-bold text-3xl md:text-4xl mb-4">Scale Beyond Limits</h2>
                    <p class="text-on-surface-variant max-w-xl mx-auto">From individual researchers to enterprise teams.</p>
                </div>
                <div class="grid md:grid-cols-12 gap-4">
                    <div class="md:col-span-6 glass-card p-8 relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                        <div class="relative z-10">
                            <span class="material-symbols-outlined text-primary text-4xl mb-4 block">visibility</span>
                            <h3 class="font-heading font-semibold text-xl mb-2">Visual Intelligence</h3>
                            <p class="text-on-surface-variant text-sm">Interactive 3D knowledge graphs that reveal hidden patterns in your data.</p>
                        </div>
                    </div>
                    <div class="md:col-span-6 glass-card p-8">
                        <span class="material-symbols-outlined text-secondary text-4xl mb-4 block">psychology</span>
                        <h3 class="font-heading font-semibold text-xl mb-2">Cognitive Link</h3>
                        <p class="text-on-surface-variant text-sm">AI-powered semantic search across all your documents simultaneously.</p>
                    </div>
                    <div class="md:col-span-4 glass-card p-8">
                        <span class="material-symbols-outlined text-tertiary text-3xl mb-4 block">bolt</span>
                        <h3 class="font-heading font-semibold text-lg mb-2">Zero Latency</h3>
                        <p class="text-on-surface-variant text-sm">Instant responses with local vector search.</p>
                    </div>
                    <div class="md:col-span-8 glass-card p-8">
                        <span class="material-symbols-outlined text-green-400 text-3xl mb-4 block">verified_user</span>
                        <h3 class="font-heading font-semibold text-lg mb-2">Enterprise Ready</h3>
                        <p class="text-on-surface-variant text-sm">SOC2 compliant, role-based access control, audit logging, and SSO integration.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 px-6 relative">
            <div class="max-w-3xl mx-auto text-center">
                <div class="glass-panel p-12 luminous-glow relative overflow-hidden">
                    <div class="core-glow absolute inset-0"></div>
                    <div class="relative z-10">
                        <h2 class="font-heading font-bold text-3xl mb-4">Ready to illuminate your mind?</h2>
                        <p class="text-on-surface-variant mb-8">Join researchers and teams already using PKE.</p>
                        <button onclick="window.location.hash='/signup'" class="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/25">
                            Start for Free
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 px-6 border-t border-white/5">
            <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="material-symbols-outlined filled text-primary text-2xl">hub</span>
                        <span class="font-heading font-bold text-lg">PKE</span>
                    </div>
                    <p class="text-on-surface-variant text-sm">Personal Knowledge Engine. Your knowledge, supercharged.</p>
                </div>
                <div>
                    <h4 class="font-heading font-semibold text-sm mb-3">Platform</h4>
                    <div class="flex flex-col gap-2 text-sm text-on-surface-variant">
                        <a href="#" class="hover:text-on-surface">Documentation</a>
                        <a href="#" class="hover:text-on-surface">Privacy Policy</a>
                        <a href="#" class="hover:text-on-surface">Terms of Service</a>
                    </div>
                </div>
                <div>
                    <h4 class="font-heading font-semibold text-sm mb-3">Connect</h4>
                    <div class="flex flex-col gap-2 text-sm text-on-surface-variant">
                        <a href="#" class="hover:text-on-surface">Twitter</a>
                        <a href="#" class="hover:text-on-surface">GitHub</a>
                    </div>
                </div>
                <div>
                    <p class="text-on-surface-variant text-sm">&copy; 2024 PKE Personal Knowledge Engine</p>
                </div>
            </div>
        </footer>`;
    },
    mount() {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = e.clientX - rect.left - rect.width / 2;
                const dy = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1000px) rotateY(${dx / 15}deg) rotateX(${-dy / 10}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    },
    unmount() {}
};
