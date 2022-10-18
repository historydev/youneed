import {MongoClient} from "mongodb";
import {QueryModel} from "../../models/databases/mongodb/query.model";

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'you_need';

export async function query(collection_name: string): Promise<QueryModel> {
	// Use connect method to connect to the server
	await client.connect();
	console.log('Connected successfully to server');
	const db = client.db(dbName);
	const collection = db.collection(collection_name);

	// the following code examples can be pasted here...

	return {
		collection,
		client
	};
}
