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
                    <h1 class="font-heading font-bold text-2xl">PKE</h1>
                    <p class="text-on-surface-variant text-sm mt-1">Create your account</p>
                </div>
                <form id="signup-form" class="space-y-4">
                    <div class="input-focus-glow rounded-lg border border-white/10 bg-surface-container/60 transition-all">
                        <label class="block px-4 pt-3 text-xs text-on-surface-variant">Full Name</label>
                        <input id="name" type="text" placeholder="Your name" class="w-full px-4 pb-3 pt-1 bg-transparent text-on-surface outline-none text-sm" required>
                    </div>
                    <div class="input-focus-glow rounded-lg border border-white/10 bg-surface-container/60 transition-all">
                        <label class="block px-4 pt-3 text-xs text-on-surface-variant">Email Address</label>
                        <input id="email" type="email" placeholder="explorer@pke.io" class="w-full px-4 pb-3 pt-1 bg-transparent text-on-surface outline-none text-sm" required>
                    </div>
                    <div>
                        <label class="block text-xs text-on-surface-variant mb-1">Password</label>
                        <div class="input-focus-glow rounded-lg border border-white/10 bg-surface-container/60 transition-all">
                            <input id="password" type="password" placeholder="Min 6 characters" class="w-full px-4 py-3 bg-transparent text-on-surface outline-none text-sm" minlength="6" required>
                        </div>
                    </div>
                    <div id="error-msg" class="text-red-400 text-sm hidden"></div>
                    <button type="submit" id="signup-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 active:scale-[0.98] transition-all">
                        Create Account
                    </button>
                </form>
                <p class="text-center text-sm text-on-surface-variant mt-6">
                    Already have an account? <a href="#/login" class="text-primary hover:underline">Sign in</a>
                </p>
            </div>
        </main>`;
    },
    mount() {
        const form = document.getElementById('signup-form');
        const errorMsg = document.getElementById('error-msg');
        const btn = document.getElementById('signup-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.classList.add('hidden');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';
            btn.disabled = true;

            try {
                const { user, token } = await api.post('/auth/register', { email, password, name });
                setToken(token);
                navigate('/dashboard');
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.classList.remove('hidden');
                btn.innerHTML = 'Create Account';
                btn.disabled = false;
            }
        });
    },
    unmount() {}
};
