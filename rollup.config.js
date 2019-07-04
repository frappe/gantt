const fs = require('fs-extra');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');

export default [
    {
        external: ['react', 'react-dom'],
        input: 'src/index.js',
        plugins: [
            resolve({
                extensions: ['.js', '.jsx', '.json'],
                // Node.js の fs, path 等のモジュールを bundle 対象外にする
                preferBuiltins: false
            }),
            commonjs({
                include: 'node_modules/**'
            }),
            postcss({
                extensions: ['.css', '.scss']
            }),
            {
                name: 'move styles to lib',
                buildStart: () => {
                    fs.emptyDirSync('./lib');
                },
                buildEnd: err => {
                    if (err) {
                        return;
                    }
                    fs.copySync('./src/gantt.scss', './lib/styles/index.scss', {
                        dereference: true
                    });
                }
            }
        ],
        output: {
            file: 'lib/index.js',
            format: 'umd',
            name: 'Gantt'
        }
    }
];
