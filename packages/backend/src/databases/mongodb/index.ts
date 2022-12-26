import { MongoClient } from "mongodb";
import { QueryModel } from "../../models/databases/mongodb/query.model";

const url = 'mongodb://localhost:27017';
const dbName = 'you_need';

export async function query(collection_name: string): Promise<QueryModel> {

	const client = new MongoClient(url);
	await client.connect();
	console.log('Connected successfully to server');
	const db = client.db(dbName);
	const collection = db.collection(collection_name);

	return {
		collection,
		client
	};
}
