import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/exports.js'),
            name: pkg.name,
            fileName: 'index',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },

            assetFileNames: ({ name }) => {
                if (/\.(gif|jpe?g|png|svg)$/.test(name || '')) {
                    return 'assets/images/[name]-[hash][extname]';
                }

                if (/\.css$/.test(name || '')) {
                    return 'assets/css/[name]-[hash][extname]';
                }

                // default value
                // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                return 'assets/[name]-[hash][extname]';
            },
        },
    },
});
