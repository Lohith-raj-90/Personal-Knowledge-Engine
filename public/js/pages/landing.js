import { isAuthenticated } from '../auth.js';
import { initLandingScene, disposeLandingScene } from '../components/three-landing.js';

let _scrollObserver = null;
let _navScrollHandler = null;
let _mobileMenuOpen = false;

function toggleMobileMenu() {
    _mobileMenuOpen = !_mobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const body = document.body;

    if (_mobileMenuOpen) {
        menu.classList.add('open');
        btn.innerHTML = '<span class="material-symbols-outlined">close</span>';
        body.classList.add('mobile-menu-open');
    } else {
        menu.classList.remove('open');
        btn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
        body.classList.remove('mobile-menu-open');
    }
}

export default {
    render() {
        const year = new Date().getFullYear();
        return `
        <a href="#hero" class="skip-to-content">Skip to content</a>
        <div id="landing-canvas" class="fixed inset-0 z-0"></div>
        <div class="grain-overlay"></div>

        <!-- NAV -->
        <nav class="fixed top-0 w-full z-50 transition-all duration-500" id="landing-nav" role="navigation" aria-label="Main navigation">
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#hero" class="flex items-center gap-3 group" aria-label="PKE — Personal Knowledge Engine Home">
                    <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <span class="material-symbols-outlined filled text-primary text-xl" aria-hidden="true">hub</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-display font-bold text-lg tracking-display leading-tight">PKE</span>
                        <span class="text-[9px] text-on-surface-variant/50 leading-tight hidden sm:block">Personal Knowledge Engine</span>
                    </div>
                </a>
                <div class="hidden md:flex items-center gap-8 text-sm text-on-surface-variant">
                    <a href="#features" class="nav-link hover:text-on-surface transition-colors duration-300">Features</a>
                    <a href="#how-it-works" class="nav-link hover:text-on-surface transition-colors duration-300">How It Works</a>
                    <a href="#showcase" class="nav-link hover:text-on-surface transition-colors duration-300">Showcase</a>
                    <a href="#contact" class="nav-link hover:text-on-surface transition-colors duration-300">Contact</a>
                </div>
                <div class="flex items-center gap-3">
                    <a href="#${isAuthenticated() ? 'dashboard' : 'login'}" class="hidden sm:flex px-5 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-300">
                        ${isAuthenticated() ? 'Dashboard' : 'Sign In'}
                    </a>
                    <a href="#/signup" class="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 btn-ripple">
                        Start Building Free
                    </a>
                    <button id="mobile-menu-btn" class="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors" aria-label="Toggle menu" onclick="window._pkeToggleMobile()">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
        </nav>

        <!-- MOBILE MENU -->
        <div id="mobile-menu" class="mobile-menu fixed inset-0 z-[60] bg-void/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden" role="dialog" aria-label="Mobile navigation">
            <a href="#features" onclick="window._pkeToggleMobile()" class="text-2xl font-display font-semibold text-on-surface hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" onclick="window._pkeToggleMobile()" class="text-2xl font-display font-semibold text-on-surface hover:text-primary transition-colors">How It Works</a>
            <a href="#showcase" onclick="window._pkeToggleMobile()" class="text-2xl font-display font-semibold text-on-surface hover:text-primary transition-colors">Showcase</a>
            <a href="#contact" onclick="window._pkeToggleMobile()" class="text-2xl font-display font-semibold text-on-surface hover:text-primary transition-colors">Contact</a>
            <div class="w-12 h-px bg-white/10 my-4"></div>
            <a href="#${isAuthenticated() ? 'dashboard' : 'login'}" onclick="window._pkeToggleMobile()" class="text-lg font-display font-medium text-on-surface-variant hover:text-on-surface transition-colors">${isAuthenticated() ? 'Dashboard' : 'Sign In'}</a>
            <a href="#/signup" onclick="window._pkeToggleMobile()" class="px-8 py-3 rounded-full bg-primary text-white font-semibold">Start Building Free</a>
        </div>

        <main class="relative z-10">
            <!-- HERO -->
            <section class="min-h-screen flex flex-col items-center justify-center relative px-6" id="hero">
                <div class="text-center max-w-4xl mx-auto">
                    <div class="scroll-reveal mb-8">
                        <div class="overline">
                            <span>Open Source</span>
                            <span class="text-on-surface-variant/30">&middot;</span>
                            <span>Self-Hosted</span>
                            <span class="text-on-surface-variant/30">&middot;</span>
                            <span>Private</span>
                        </div>
                    </div>
                    <h1 class="font-display font-extrabold tracking-display leading-[0.9] mb-8 scroll-reveal" style="font-size: clamp(2.8rem, 7vw, 5.5rem);">
                        <span class="text-on-surface block">Your Knowledge,</span>
                        <span class="gradient-text block">Interconnected.</span>
                    </h1>
                    <p class="text-lg md:text-xl text-on-surface-variant/70 mb-6 max-w-2xl mx-auto leading-relaxed scroll-reveal">
                        A private RAG platform that transforms documents into interconnected intelligence. Chat with AI, build knowledge graphs, and master concepts.
                    </p>
                    <p class="text-sm text-on-surface-variant/40 mb-12 max-w-lg mx-auto scroll-reveal">
                        Built for researchers, engineers, and teams who demand privacy without compromise.
                    </p>
                    <div class="flex flex-wrap items-center justify-center gap-4 mb-20 scroll-reveal">
                        <a href="#/signup" class="group relative px-8 py-4 rounded-full bg-primary text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:brightness-110 hover:scale-[1.02] btn-ripple">
                            <span class="relative z-10 flex items-center gap-2">
                                Start Building Free
                                <span class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </span>
                        </a>
                        <a href="#features" class="px-8 py-4 rounded-full bg-white/[0.04] border border-white/10 text-on-surface-variant font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                            Explore Features
                        </a>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto scroll-reveal">
                        <div class="stat-card">
                            <div class="font-display font-bold text-2xl md:text-3xl text-on-surface">1.8T<span class="text-primary text-lg">+</span></div>
                            <div class="text-[10px] font-mono text-on-surface-variant/50 tracking-widest uppercase mt-1">Model Params</div>
                        </div>
                        <div class="stat-card">
                            <div class="font-display font-bold text-2xl md:text-3xl text-on-surface">128K</div>
                            <div class="text-[10px] font-mono text-on-surface-variant/50 tracking-widest uppercase mt-1">Context Window</div>
                        </div>
                        <div class="stat-card">
                            <div class="font-display font-bold text-2xl md:text-3xl text-primary">96.2<span class="text-lg">%</span></div>
                            <div class="text-[10px] font-mono text-on-surface-variant/50 tracking-widest uppercase mt-1">MMLU Score</div>
                        </div>
                        <div class="stat-card">
                            <div class="font-display font-bold text-2xl md:text-3xl text-on-surface">&lt;50<span class="text-primary text-lg">ms</span></div>
                            <div class="text-[10px] font-mono text-on-surface-variant/50 tracking-widest uppercase mt-1">Query Latency</div>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-float opacity-50">
                    <span class="text-[10px] text-on-surface-variant/40 tracking-overline uppercase font-mono">Scroll</span>
                    <div class="w-5 h-8 rounded-full border border-on-surface-variant/20 flex justify-center pt-1.5">
                        <div class="w-1 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                    </div>
                </div>
            </section>

            <!-- FEATURES -->
            <section id="features" class="py-40 px-6 relative">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-24 scroll-reveal">
                        <span class="overline mb-6 block"><span>Core Capabilities</span></span>
                        <h2 class="font-display font-bold text-4xl md:text-5xl tracking-display mb-5">Built for How You Think</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">Three powerful features that transform scattered documents into structured, searchable intelligence.</p>
                    </div>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden card-glow-blue">
                            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/60 to-primary/0 rounded-r"></div>
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-2xl">hub</span>
                                    </div>
                                    <span class="text-xs font-mono text-on-surface-variant/30">01</span>
                                </div>
                                <h3 class="font-display font-semibold text-lg mb-3">Knowledge Graphs</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Automatically discover and visualize relationships between concepts across your entire document library.</p>
                            </div>
                        </div>
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden card-glow-purple">
                            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary/60 to-secondary/0 rounded-r"></div>
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-secondary text-2xl">forum</span>
                                    </div>
                                    <span class="text-xs font-mono text-on-surface-variant/30">02</span>
                                </div>
                                <h3 class="font-display font-semibold text-lg mb-3">AI Chat & RAG</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Ask questions in natural language. Get answers grounded in your documents with full source attribution.</p>
                            </div>
                        </div>
                        <div class="glass-card p-8 tilt-card scroll-reveal group cursor-default relative overflow-hidden card-glow-amber">
                            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-tertiary/60 to-tertiary/0 rounded-r"></div>
                            <div class="absolute inset-0 bg-gradient-to-br from-tertiary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-tertiary text-2xl">school</span>
                                    </div>
                                    <span class="text-xs font-mono text-on-surface-variant/30">03</span>
                                </div>
                                <h3 class="font-display font-semibold text-lg mb-3">Learning Paths</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Generate flashcards and structured courses from your documents. Track progress and master topics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- HOW IT WORKS -->
            <section id="how-it-works" class="py-32 px-6 relative">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-20 scroll-reveal">
                        <span class="overline mb-6 block"><span>Workflow</span></span>
                        <h2 class="font-display font-bold text-4xl md:text-5xl tracking-display mb-5">Three Steps to Intelligence</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">From raw documents to actionable insights in minutes.</p>
                    </div>
                    <div class="relative">
                        <div class="timeline-line"></div>
                        <div class="space-y-12 md:space-y-16">
                            <div class="flex gap-6 md:gap-12 scroll-reveal">
                                <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-primary text-2xl">upload_file</span>
                                </div>
                                <div class="glass-card p-6 md:p-8 flex-1">
                                    <span class="text-xs font-mono text-primary mb-3 block">Step 01</span>
                                    <h3 class="font-display font-semibold text-xl mb-2">Upload Documents</h3>
                                    <p class="text-on-surface-variant text-sm leading-relaxed">Drop PDFs, DOCX, or text files. PKE extracts, indexes, and prepares them for intelligent retrieval. Support for batch uploads and drag-and-drop.</p>
                                </div>
                            </div>
                            <div class="flex gap-6 md:gap-12 scroll-reveal">
                                <div class="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-secondary text-2xl">psychology</span>
                                </div>
                                <div class="glass-card p-6 md:p-8 flex-1">
                                    <span class="text-xs font-mono text-secondary mb-3 block">Step 02</span>
                                    <h3 class="font-display font-semibold text-xl mb-2">Ask & Discover</h3>
                                    <p class="text-on-surface-variant text-sm leading-relaxed">Chat with your knowledge base. PKE finds relevant passages and generates grounded answers with source attribution.</p>
                                </div>
                            </div>
                            <div class="flex gap-6 md:gap-12 scroll-reveal">
                                <div class="w-16 h-16 rounded-full bg-tertiary/10 border border-tertiary/30 flex items-center justify-center shrink-0 relative z-10">
                                    <span class="material-symbols-outlined text-tertiary text-2xl">account_tree</span>
                                </div>
                                <div class="glass-card p-6 md:p-8 flex-1">
                                    <span class="text-xs font-mono text-tertiary mb-3 block">Step 03</span>
                                    <h3 class="font-display font-semibold text-xl mb-2">Master & Connect</h3>
                                    <p class="text-on-surface-variant text-sm leading-relaxed">Build knowledge graphs, generate learning paths, and see how everything connects across your documents.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SHOWCASE -->
            <section id="showcase" class="py-24 px-6 relative">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16 scroll-reveal">
                        <span class="overline mb-6 block"><span>Platform</span></span>
                        <h2 class="font-display font-bold text-4xl md:text-5xl tracking-display mb-5">Why PKE</h2>
                        <p class="text-on-surface-variant max-w-xl mx-auto text-lg">Everything you need to transform raw documents into a living knowledge base.</p>
                    </div>
                    <div class="bento-grid">
                        <div class="md:col-span-8 md:row-span-2 glass-card p-8 scroll-reveal reveal-scale relative overflow-hidden group card-glow-blue">
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10 h-full flex flex-col">
                                <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-primary text-3xl">visibility</span>
                                </div>
                                <h3 class="font-display font-semibold text-2xl mb-3">3D Knowledge Visualization</h3>
                                <p class="text-on-surface-variant leading-relaxed flex-1">Interactive force-directed graphs that reveal hidden patterns. Drag, zoom, and explore your knowledge landscape in real-time 3D.</p>
                                <div class="mt-6 h-32 rounded-xl bg-surface-container/50 border border-white/5 flex items-center justify-center overflow-hidden">
                                    <div class="text-on-surface-variant/30 text-sm font-mono">3D Preview</div>
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-4 glass-card p-8 scroll-reveal reveal-scale relative overflow-hidden group card-glow-purple">
                            <div class="absolute inset-0 bg-gradient-to-br from-secondary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-5">
                                    <span class="material-symbols-outlined text-secondary text-3xl">shield</span>
                                </div>
                                <h3 class="font-display font-semibold text-xl mb-2">Self-Hosted Security</h3>
                                <p class="text-on-surface-variant text-sm leading-relaxed">Your data never leaves your infrastructure. End-to-end encryption and audit logging.</p>
                            </div>
                        </div>
                        <div class="md:col-span-4 glass-card p-6 scroll-reveal reveal-scale relative overflow-hidden group card-glow-amber">
                            <div class="absolute inset-0 bg-gradient-to-br from-tertiary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative z-10">
                                <div class="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-tertiary text-xl">bolt</span>
                                </div>
                                <h3 class="font-display font-semibold text-base mb-2">Instant Search</h3>
                                <p class="text-on-surface-variant text-xs leading-relaxed">Hybrid vector search with sub-second results.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-3 gap-5 mt-5">
                        <div class="glass-card p-6 scroll-reveal reveal-scale relative overflow-hidden group card-glow-blue">
                            <div class="relative z-10">
                                <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-primary text-xl">code</span>
                                </div>
                                <h3 class="font-display font-semibold text-base mb-2">Open Source</h3>
                                <p class="text-on-surface-variant text-xs leading-relaxed">Fully open codebase. Contribute, customize, and extend.</p>
                            </div>
                        </div>
                        <div class="glass-card p-6 scroll-reveal reveal-scale relative overflow-hidden group card-glow-purple">
                            <div class="relative z-10">
                                <div class="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-secondary text-xl">groups</span>
                                </div>
                                <h3 class="font-display font-semibold text-base mb-2">Team Spaces</h3>
                                <p class="text-on-surface-variant text-xs leading-relaxed">Shared knowledge graphs and collaborative learning paths.</p>
                            </div>
                        </div>
                        <div class="glass-card p-6 scroll-reveal reveal-scale relative overflow-hidden group card-glow-amber">
                            <div class="relative z-10">
                                <div class="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-tertiary text-xl">api</span>
                                </div>
                                <h3 class="font-display font-semibold text-base mb-2">REST API</h3>
                                <p class="text-on-surface-variant text-xs leading-relaxed">Full API access for custom integrations and workflows.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA -->
            <section class="py-40 px-6 relative">
                <div class="max-w-3xl mx-auto text-center scroll-reveal">
                    <div class="glass-panel p-12 md:p-20 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-secondary/[0.03] to-tertiary/[0.04]"></div>
                        <div class="relative z-10">
                            <h2 class="font-display font-bold text-4xl md:text-5xl tracking-display mb-5 leading-tight">Ready to build<br>something <span class="gradient-text">brilliant</span>?</h2>
                            <p class="text-on-surface-variant text-lg mb-10">Join researchers and engineers building their knowledge base with PKE.</p>
                            <a href="#/signup" class="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 btn-ripple">
                                Start Building Free
                                <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                            </a>
                            <p class="text-xs text-on-surface-variant/40 mt-6 font-mono">Free tier available · No credit card required</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SECTION DIVIDER -->
            <div class="section-divider"></div>

            <!-- CONTACT -->
            <section id="contact" class="py-24 px-6 relative">
                <div class="max-w-2xl mx-auto">
                    <div class="text-center mb-12 scroll-reveal">
                        <span class="overline mb-6 block"><span>Get in Touch</span></span>
                        <h2 class="font-display font-bold text-4xl md:text-5xl tracking-display mb-5">Let's Connect</h2>
                        <p class="text-on-surface-variant max-w-lg mx-auto text-lg">Have questions, feedback, or want to collaborate? We'd love to hear from you.</p>
                    </div>
                    <div class="glass-card p-10 scroll-reveal text-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-secondary/[0.02] to-tertiary/[0.02]"></div>
                        <div class="relative z-10">
                            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <span class="material-symbols-outlined filled text-3xl text-primary">person</span>
                            </div>
                            <p class="font-display font-semibold text-xl mb-1">Lohith Raj</p>
                            <p class="text-on-surface-variant text-sm mb-6">Developer & Creator of PKE</p>
                            <div class="flex items-center justify-center gap-4">
                                <a href="mailto:lohithraj9090@gmail.com" class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 hover:border-primary/40 transition-all duration-300">
                                    <span class="material-symbols-outlined text-lg">mail</span>
                                    Email
                                </a>
                                <a href="https://github.com/Lohith-raj-90" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface-variant text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="py-12 px-6 border-t border-white/5">
                <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <a href="#hero" class="flex items-center gap-3 group">
                        <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                            <span class="material-symbols-outlined filled text-primary text-xl">hub</span>
                        </div>
                        <span class="font-display font-bold text-lg tracking-display">PKE</span>
                    </a>
                    <div class="flex items-center gap-6 text-sm text-on-surface-variant">
                        <a href="#features" class="hover:text-on-surface transition-colors">Features</a>
                        <a href="#how-it-works" class="hover:text-on-surface transition-colors">How It Works</a>
                        <a href="#showcase" class="hover:text-on-surface transition-colors">Showcase</a>
                        <a href="#contact" class="hover:text-on-surface transition-colors">Contact</a>
                        <a href="https://github.com/Lohith-raj-90" target="_blank" rel="noopener noreferrer" class="hover:text-on-surface transition-colors">GitHub</a>
                    </div>
                    <p class="text-on-surface-variant/40 text-sm font-mono">&copy; ${year} PKE. Open source.</p>
                </div>
            </footer>
        </main>`;
    },

    mount() {
        window._pkeToggleMobile = toggleMobileMenu;

        initLandingScene('landing-canvas');

        const nav = document.getElementById('landing-nav');
        _navScrollHandler = () => {
            if (window.scrollY > 50) {
                nav.classList.add('bg-surface/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            } else {
                nav.classList.remove('bg-surface/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            }
        };
        window.addEventListener('scroll', _navScrollHandler, { passive: true });
        _navScrollHandler();

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = e.clientX - rect.left - rect.width / 2;
                const dy = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1200px) rotateY(${dx / 25}deg) rotateX(${-dy / 20}deg) translateY(-8px) scale(1.01)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        document.querySelectorAll('.btn-ripple').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                btn.style.setProperty('--ripple-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
                btn.style.setProperty('--ripple-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
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
        if (_navScrollHandler) {
            window.removeEventListener('scroll', _navScrollHandler);
            _navScrollHandler = null;
        }
        window._pkeToggleMobile = null;
        _mobileMenuOpen = false;
        document.body.classList.remove('mobile-menu-open');
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.remove('open');
    }
};
