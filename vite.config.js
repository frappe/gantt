import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'Gantt',
            fileName: 'frappe-gantt',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            },
        },
    },
    output: { interop: 'auto' },
    server: { watch: { include: ['dist/*', 'src/*'] } }
});