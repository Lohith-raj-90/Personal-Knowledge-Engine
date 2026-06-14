import { initRouter, register, navigate } from './router.js';
import { isAuthenticated } from './auth.js';

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const colors = {
        error: 'bg-red-500/90',
        success: 'bg-green-500/90',
        info: 'bg-primary/90'
    };
    const toast = document.createElement('div');
    toast.className = `${colors[type] || colors.info} text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-fade-up`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

window.showToast = showToast;

async function loadPage(name) {
    const mod = await import(`./pages/${name}.js`);
    return mod.default;
}

function authGuard(loader) {
    return async () => {
        const mod = await loader();
        return {
            ...mod,
            mount: async (ctx) => {
                if (!isAuthenticated() && ctx?.params?.[0] !== 'login' && ctx?.params?.[0] !== 'signup') {
                    navigate('/login');
                    return;
                }
                if (mod.mount) await mod.mount(ctx);
            }
        };
    };
}

register('/', () => loadPage('landing'));
register('/login', () => loadPage('login'));
register('/signup', () => loadPage('signup'));
register('/dashboard', authGuard(() => loadPage('dashboard')));
register('/graph', authGuard(() => loadPage('graph')));
register('/learn', authGuard(() => loadPage('learn')));

initRouter();
