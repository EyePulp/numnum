import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        host: true,
        strictPort: true,
        hmr: { path: '/wss', clientPort: 80 },
        proxy: {
            '/wss': {
                target: 'ws://localhost:5173',
                ws: true,
            },
        },
    },
});
