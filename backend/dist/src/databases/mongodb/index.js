"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017';
const dbName = 'you_need';
async function query(collection_name) {
    const client = new mongodb_1.MongoClient(url);
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection(collection_name);
    return {
        collection,
        client
    };
}
exports.query = query;
//# sourceMappingURL=index.js.map