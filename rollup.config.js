import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript'

const dev = {
    input: 'src/ts/index.ts',
    output: {
        name: 'Gantt',
        file: 'dist/frappe-gantt.js',
        sourcemap: true,
        format: 'iife',
    },
    plugins: [
        sass({
            output: true,
        }),
        typescript()
    ],
};
const prod = {
    input: 'src/ts/index.ts',
    output: {
        name: 'Gantt',
        file: 'dist/frappe-gantt.min.js',
        sourcemap: true,
        format: 'iife',
    },
    plugins: [
        sass({
            output: true,
            options: {
                outputStyle: 'compressed',
            },
        }),
        terser(),
        typescript()
    ],
};

export default [dev, prod];
