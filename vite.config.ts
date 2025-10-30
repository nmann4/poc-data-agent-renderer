import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        server: {
            port: 5174,
            host: 'localhost',
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
        preview: {
            port: 4173,
            host: 'localhost',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        },
        // Set base to repo name for GitHub Pages
        // e.g., if your repo is github.com/username/poc-data-agent-renderer
        // the site will be at username.github.io/poc-data-agent-renderer/
        base: mode === 'production' ? '/poc-data-agent-renderer/' : '/',
    };
});
