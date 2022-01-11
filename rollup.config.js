import sass from 'rollup-plugin-sass';
import uglify from 'rollup-plugin-uglify';
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
            include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
            output: 'dist/frappe-gantt.css'
        })
    ]
};
const prod = merge(dev, {
    output: {
        file: 'dist/frappe-gantt.min.js'
    },
    plugins: [uglify.uglify()]
});

export default [dev, prod];
