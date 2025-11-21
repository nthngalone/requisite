import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const config = {
        plugins: [vue()],
        build: {
            lib: {
                entry: 'lib/index.ts',
                name: 'requisite-ux',
                fileName: (format: string) => `requisite-ux.${format}.js`
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./lib', import.meta.url))
            }
        }
    };
    return config;
});
