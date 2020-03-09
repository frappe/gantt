import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';
import merge from 'deepmerge';

const dev = {
    input: 'src/index.js',
    output: {
        name: 'Gantt',
        file: 'dist/frappe-gantt.js',
        format: 'iife'
    },
    plugins: [
        sass({
            output: 'dist/frappe-gantt.css'
        })
    ]
};
const prod = merge(dev, {
    output: {
        file: 'dist/frappe-gantt.min.js'
    },
    plugins: [terser()]
});

export default [dev, prod];
