const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, '.env')});

esbuild.build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    tsconfig: "tsconfig.json",
    define: {
        "process.env.JWT_SECRET": "\"supercat\"",
        "process.env.PORT": "\"4000\"",
        "process.env.HOST": "\"http://localhost:4200\"",
        "process.env.MONGO_IP": "\"my-mongodb\""
    },
    minify: true,
    outfile: '../../dist/backend/server.js',
    plugins: [nodeExternalsPlugin()],
});