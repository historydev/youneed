const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
    entryPoints: ['./main.js'],
    bundle: true,
    platform: 'node',
    minify: true,
    outfile: '../../dist/static_hoster/main.js',
    plugins: [nodeExternalsPlugin()],
});