import { navigate } from '../router.js';
import { isAuthenticated } from '../auth.js';
import { initLandingScene, disposeLandingScene } from '../components/three-landing.js';

let _scrollObserver = null;

export default {
    render() {
        return `
        <div id="landing-canvas" class="fixed inset-0 z-0"></div>

        <div class="grain-overlay"></div>

        <nav class="fixed top-0 w-full z-50 transition-all duration-500" id="landing-nav">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                        <span class="material-symbols-outlined filled text-primary text-xl">hub</span>
                    </div>
                    <span class="font-heading font-bold text-lg tracking-tight">PKE</span>
                </div>
                <div class="hidden md:flex items-center gap-8 text-sm text-on-surface-variant">
                    <a href="#features" class="hover:text-on-surface transition-colors duration-300">Features</a>
                    <a href="#how-it-works" class="hover:text-on-surface transition-colors duration-300">How It Works</a>
                    <a href="#showcase" class="hover:text-on-surface transition-colors duration-300">Showcase</a>
                    <a href="#contact" class="hover:text-on-surface transition-colors duration-300">Contact</a>
                </div>
                <div class="flex items-center gap-3">
                    <a href="#${isAuthenticated() ? 'dashboard' : 'login'}" class="px-5 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-300">
                        ${isAuthenticated() ? 'Dashboard' : 'Sign In'}
                    </a>
                    <a href="#/signup" class="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300">
                        Get Started
                    </a>
                </div>
            </div>
        </nav>

        <main class="relative z-10">
            <section class="min-h-screen flex flex-col items-center justify-center relative px-6" id="hero">
                <div class="text-center max-w-4xl mx-auto scroll-reveal">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/50 border border-white/5 mb-8 text-xs text-on-surface-variant backdrop-blur-sm">
                        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Open Source &middot; Self-Hosted &middot; Private
                    </div>
                    <h1 class="font-heading font-bold text-5xl sm:text-6xl md:text-8xl mb-6 leading-[0.95] tracking-tight">
                        <span class="text-glow">Your Knowledge</span><br>
                        <span class="gradient-text">Supercharged</span>
                    </h1>
                    <p class="text-lg md:text-xl text-on-surface-variant/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                        A private RAG platform that transforms documents into interconnected intelligence. Chat with AI, build knowledge graphs, and master concepts.
                    </p>
                    <p class="text-sm text-on-surface-variant/50 mb-10 max-w-lg mx-auto">
                        Built for researchers, engineers, and teams who demand privacy without compromise.
                    </p>
                    <div class="flex flex-wrap items-center justify-center gap-4">
                        <a href="#/signup" class="group relative px-8 py-3.5 rounded-full bg-primary text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 hover:scale-[1.02]">
                            <span class="relative z-10 flex items-center gap-2">
                                Start Building Free
                                <span class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </span>
                        </a>
                        <a href="#features" class="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-on-surface-variant font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                            Explore Features
                        </a>
                    </div>
                </div>
                <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float opacity-40">
                    <span class="text-xs text-on-surface-variant/50 tracking-widest uppercase">Scroll</span>
                    <span class="material-symbols-outlined text-2xl text-on-surface-variant/30">expand_more</span>
                </div>
            </section>

            <section id="features" class="py-32 px-6 relative">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-20 scroll-reveal">
                        <span class="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">Capabilities</span>
                        <h2 class="font-heading font-bold text-4xl md:text-5xl mb-5">Intelligent by Design</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">Every feature engineered to transform how you work with information.</p>
                    </div>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-primary text-2xl">hub</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">Knowledge Graphs</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Automatically discover and visualize relationships between concepts across your entire document library.</p>
                            </div>
                        </div>
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden" style="animation-delay: 0.1s">
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-secondary text-2xl">forum</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">AI Chat & RAG</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Ask questions in natural language. Get answers grounded in your documents with full source attribution.</p>
                            </div>
                        </div>
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden" style="animation-delay: 0.2s">
                            <div class="absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-tertiary text-2xl">school</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">Learning Paths</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Generate flashcards and structured courses from your documents. Track progress and master topics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" class="py-32 px-6 relative">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-20 scroll-reveal">
                        <span class="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">Workflow</span>
                        <h2 class="font-heading font-bold text-4xl md:text-5xl mb-5">Three Steps to Intelligence</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">From raw documents to actionable insights in minutes.</p>
                    </div>
                    <div class="relative">
                        <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-secondary/20 to-tertiary/20 hidden md:block"></div>
                        <div class="space-y-16">
                            <div class="flex flex-col md:flex-row items-center gap-8 scroll-reveal">
                                <div class="flex-1 md:text-right">
                                    <div class="glass-card p-6 inline-block">
                                        <span class="text-xs font-mono text-primary mb-2 block">Step 01</span>
                                        <h3 class="font-heading font-semibold text-xl mb-2">Upload Documents</h3>
                                        <p class="text-on-surface-variant text-sm">Drop PDFs, DOCX, or text files. PKE extracts, indexes, and prepares them for intelligent retrieval.</p>
                                    </div>
                                </div>
                                <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-primary text-2xl">upload_file</span>
                                </div>
                                <div class="flex-1 hidden md:block"></div>
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-8 scroll-reveal">
                                <div class="flex-1 hidden md:block"></div>
                                <div class="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-secondary text-2xl">psychology</span>
                                </div>
                                <div class="flex-1">
                                    <div class="glass-card p-6 inline-block">
                                        <span class="text-xs font-mono text-secondary mb-2 block">Step 02</span>
                                        <h3 class="font-heading font-semibold text-xl mb-2">Ask & Discover</h3>
                                        <p class="text-on-surface-variant text-sm">Chat with your knowledge base. PKE finds relevant passages and generates grounded answers.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-8 scroll-reveal">
                                <div class="flex-1 md:text-right">
                                    <div class="glass-card p-6 inline-block">
                                        <span class="text-xs font-mono text-tertiary mb-2 block">Step 03</span>
                                        <h3 class="font-heading font-semibold text-xl mb-2">Master & Connect</h3>
                                        <p class="text-on-surface-variant text-sm">Build knowledge graphs, generate learning paths, and see how everything connects.</p>
                                    </div>
                                </div>
                                <div class="w-16 h-16 rounded-full bg-tertiary/10 border border-tertiary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-tertiary text-2xl">account_tree</span>
                                </div>
                                <div class="flex-1 hidden md:block"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="showcase" class="py-32 px-6 relative">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-20 scroll-reveal">
                        <span class="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">Platform</span>
                        <h2 class="font-heading font-bold text-4xl md:text-5xl mb-5">Built for Scale</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">From individual researchers to enterprise teams.</p>
                    </div>
                    <div class="grid md:grid-cols-12 gap-5">
                        <div class="md:col-span-7 glass-card p-8 scroll-reveal relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-primary text-3xl">visibility</span>
                                </div>
                                <h3 class="font-heading font-semibold text-2xl mb-3">3D Knowledge Visualization</h3>
                                <p class="text-on-surface-variant leading-relaxed">Interactive force-directed graphs that reveal hidden patterns. Drag, zoom, and explore your knowledge landscape in real-time 3D.</p>
                            </div>
                        </div>
                        <div class="md:col-span-5 glass-card p-8 scroll-reveal relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-secondary text-3xl">shield</span>
                                </div>
                                <h3 class="font-heading font-semibold text-2xl mb-3">Self-Hosted Security</h3>
                                <p class="text-on-surface-variant leading-relaxed">Your data never leaves your infrastructure. End-to-end encryption, RBAC, and audit logging built in.</p>
                            </div>
                        </div>
                        <div class="md:col-span-4 glass-card p-8 scroll-reveal relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-tertiary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-tertiary text-2xl">bolt</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">Instant Search</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">TF-IDF vector search delivers sub-second results across thousands of documents.</p>
                            </div>
                        </div>
                        <div class="md:col-span-4 glass-card p-8 scroll-reveal relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-primary text-2xl">code</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">Open Source</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Fully open codebase. Contribute, customize, and extend PKE for your specific needs.</p>
                            </div>
                        </div>
                        <div class="md:col-span-4 glass-card p-8 scroll-reveal relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/8 to-tertiary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-secondary text-2xl">groups</span>
                                </div>
                                <h3 class="font-heading font-semibold text-lg mb-2">Team Spaces</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Shared knowledge graphs and collaborative learning paths for teams.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-32 px-6 relative">
                <div class="max-w-3xl mx-auto text-center scroll-reveal">
                    <div class="glass-panel p-16 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5"></div>
                        <div class="relative z-10">
                            <h2 class="font-heading font-bold text-4xl md:text-5xl mb-5 leading-tight">Ready to build<br>something <span class="gradient-text">brilliant</span>?</h2>
                            <p class="text-on-surface-variant text-lg mb-10">Join researchers and engineers already using PKE to transform their workflow.</p>
                            <a href="#/signup" class="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/40">
                                Get Started Free
                                <span class="material-symbols-outlined">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" class="py-32 px-6 relative">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-16 scroll-reveal">
                        <span class="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">Get in Touch</span>
                        <h2 class="font-heading font-bold text-4xl md:text-5xl mb-5">Contact the Developer</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">Have questions, feedback, or want to collaborate? I'd love to hear from you.</p>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6 scroll-reveal">
                        <a href="mailto:lohithraj9090@gmail.com" class="glass-card p-8 tilt-card group cursor-pointer transition-all duration-300 hover:border-primary/30 relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10 flex items-start gap-5">
                                <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-primary text-2xl">mail</span>
                                </div>
                                <div>
                                    <h3 class="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Email</h3>
                                    <p class="text-on-surface-variant text-sm mb-3">Drop me a line anytime</p>
                                    <span class="text-primary text-sm font-medium">lohithraj9090@gmail.com</span>
                                </div>
                            </div>
                        </a>
                        <a href="https://github.com/Lohith-raj-90" target="_blank" rel="noopener noreferrer" class="glass-card p-8 tilt-card group cursor-pointer transition-all duration-300 hover:border-secondary/30 relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10 flex items-start gap-5">
                                <div class="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                                    <svg class="w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                </div>
                                <div>
                                    <h3 class="font-heading font-semibold text-lg mb-1 group-hover:text-secondary transition-colors">GitHub</h3>
                                    <p class="text-on-surface-variant text-sm mb-3">Check out my projects & contributions</p>
                                    <span class="text-secondary text-sm font-medium">github.com/Lohith-raj-90</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <footer class="py-12 px-6 border-t border-white/5">
                <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span class="material-symbols-outlined filled text-primary text-lg">hub</span>
                        </div>
                        <span class="font-heading font-bold">PKE</span>
                        <span class="text-on-surface-variant text-sm">&middot; Personal Knowledge Engine</span>
                    </div>
                    <div class="flex items-center gap-6 text-sm text-on-surface-variant">
                        <a href="#features" class="hover:text-on-surface transition-colors">Features</a>
                        <a href="#contact" class="hover:text-on-surface transition-colors">Contact</a>
                        <a href="https://github.com/Lohith-raj-90" target="_blank" rel="noopener noreferrer" class="hover:text-on-surface transition-colors">GitHub</a>
                    </div>
                    <p class="text-on-surface-variant/50 text-sm">&copy; 2025 PKE. Open source.</p>
                </div>
            </footer>
        </main>`;
    },

    mount() {
        initLandingScene('landing-canvas');

        const nav = document.getElementById('landing-nav');
        const onScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('bg-surface/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            } else {
                nav.classList.remove('bg-surface/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = e.clientX - rect.left - rect.width / 2;
                const dy = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1000px) rotateY(${dx / 20}deg) rotateX(${-dy / 15}deg) translateY(-4px) scale(1.01)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        _scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            _scrollObserver.observe(el);
        });
    },

    unmount() {
        disposeLandingScene();
        if (_scrollObserver) {
            _scrollObserver.disconnect();
            _scrollObserver = null;
        }
    }
};
