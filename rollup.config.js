import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const dev = {
    input: 'src/index.js',
    output: {
        name: 'Gantt',
        file: 'dist/frappe-gantt.js',
        sourcemap: true,
        format: 'iife',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        sass({
            output: true,
        }),
    ],
};
const prod = {
    input: 'src/index.js',
    output: {
        name: 'Gantt',
        file: 'dist/frappe-gantt.min.js',
        sourcemap: true,
        format: 'iife',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        sass({
            output: true,
            options: {
                outputStyle: 'compressed',
            },
        }),
        terser(),
    ],
};

export default [dev, prod];
