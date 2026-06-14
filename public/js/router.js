const routes = {};
let current = null;

export function register(path, loader) {
    routes[path] = loader;
}

export function navigate(path) {
    window.location.hash = path;
}

export function getParams() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/').filter(Boolean);
    return parts;
}

async function handleRoute() {
    try {
        const hash = window.location.hash.slice(1) || '/';
        const parts = hash.split('/').filter(Boolean);
        const path = '/' + (parts[0] || '');

        if (current && current.unmount) {
            current.unmount();
        }

        const loader = routes[path];
        if (!loader) {
            document.getElementById('app').innerHTML = '<div class="flex items-center justify-center h-screen"><h1 class="text-2xl text-on-surface-variant">404 — Page Not Found</h1></div>';
            return;
        }

        current = await loader();
        const app = document.getElementById('app');
        app.innerHTML = current.render();
        if (current.mount) {
            await current.mount({ params: parts.slice(1) });
        }
    } catch (err) {
        console.error('Route error:', err);
        document.getElementById('app').innerHTML = '<div class="flex items-center justify-center h-screen"><h1 class="text-2xl text-red-400">Something went wrong</h1></div>';
    }
}

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}
