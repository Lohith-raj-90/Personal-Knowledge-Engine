import { api } from '../api.js';
import { setToken } from '../auth.js';
import { navigate } from '../router.js';

export default {
    render() {
        return `
        <div class="grain-overlay"></div>
        <div class="mesh-gradient-bg fixed inset-0 z-0"></div>
        <main class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div class="glass-panel p-10 w-full max-w-md luminous-glow">
                <div class="text-center mb-8">
                    <span class="material-symbols-outlined filled text-primary text-5xl block mb-3">hub</span>
                    <h1 class="font-display font-bold text-2xl">PKE</h1>
                    <p class="text-on-surface-variant text-sm mt-1">Personal Knowledge Engine</p>
                </div>
                <div class="flex gap-3 mb-6">
                    <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-high/60 border border-white/5 text-sm hover:border-white/20 transition-all">
                        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google
                    </button>
                    <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-high/60 border border-white/5 text-sm hover:border-white/20 transition-all">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </button>
                </div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex-1 h-px bg-white/10"></div>
                    <span class="text-xs text-on-surface-variant">or email</span>
                    <div class="flex-1 h-px bg-white/10"></div>
                </div>
                <form id="login-form" class="space-y-4">
                    <div class="input-focus-glow rounded-lg border border-white/10 bg-surface-container/60 transition-all">
                        <label class="block px-4 pt-3 text-xs text-on-surface-variant">Email Address</label>
                        <input id="email" type="email" placeholder="explorer@pke.io" class="w-full px-4 pb-3 pt-1 bg-transparent text-on-surface outline-none text-sm" required>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="text-xs text-on-surface-variant">Password</label>
                            <a href="#" class="text-xs text-primary hover:underline">Forgot password?</a>
                        </div>
                        <div class="input-focus-glow rounded-lg border border-white/10 bg-surface-container/60 transition-all">
                            <input id="password" type="password" placeholder="••••••••" class="w-full px-4 py-3 bg-transparent text-on-surface outline-none text-sm" required>
                        </div>
                    </div>
                    <div id="error-msg" class="text-red-400 text-sm hidden"></div>
                    <button type="submit" id="login-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 active:scale-[0.98] transition-all">
                        Sign In
                    </button>
                </form>
                <p class="text-center text-sm text-on-surface-variant mt-6">
                    New explorer? <a href="#/signup" class="text-primary hover:underline">Create an account</a>
                </p>
            </div>
            <footer class="relative z-10 mt-8 text-center text-xs text-on-surface-variant/50">
                <p>&copy; 2024 PKE Personal Knowledge Engine</p>
            </footer>
        </main>`;
    },
    mount() {
        const form = document.getElementById('login-form');
        const errorMsg = document.getElementById('error-msg');
        const btn = document.getElementById('login-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.classList.add('hidden');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';
            btn.disabled = true;

            try {
                const { user, token } = await api.post('/auth/login', { email, password });
                setToken(token);
                navigate('/dashboard');
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.classList.remove('hidden');
                btn.innerHTML = 'Sign In';
                btn.disabled = false;
            }
        });
    },
    unmount() {}
};
