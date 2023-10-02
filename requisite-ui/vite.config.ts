import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const config = {
        plugins: [
            vue()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
    if (command === 'serve') {
        config.resolve.alias['./HttpClientExtensions'] = path.resolve(__dirname, './mock/HttpClientExtensionsMock');
    }
    return config;
});
