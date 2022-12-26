const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    tsconfig: "tsconfig.json",
    define: {
        "process.env.JWT_SECRET": "\"supercat\"",
        "process.env.PORT": "4000"
    },
    minify: true,
    outfile: '../../dist/backend/main.js',
    plugins: [nodeExternalsPlugin()],
});