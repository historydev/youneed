const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, 'environment', '.env_prod')});

esbuild.build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    tsconfig: "tsconfig.json",
    define: {
        "process.env.JWT_SECRET": `\"${process.env.JWT_SECRET}\"`,
        "process.env.PORT": `\"${process.env.PORT}\"`,
        "process.env.HOST": `\"${process.env.HOST}\"`,
        "process.env.MONGO_IP": `\"${process.env.MONGO_IP}\"`
    },
    minify: true,
    outfile: '../../dist/backend/server.js',
    plugins: [nodeExternalsPlugin()],
});