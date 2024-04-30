import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';
import path from 'node:path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: pkg.name,
            fileName: 'frappe-gantt',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue'
                }
            },
            // input: [path.join(process.cwd(), 'index.html'), path.join(process.cwd(), 'src', 'index.js')],
            // preserveEntrySignatures: "allow-extension"
        },
    },
    output: { interop: 'auto' }
});