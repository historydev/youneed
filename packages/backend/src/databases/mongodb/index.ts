import {MongoClient} from "mongodb";
import {QueryModel} from "../../models/databases/mongodb/query.model";
import * as path from "path";
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '..', '..', '..', '.env')});

console.log(process.env.MONGO_IP)

const url = `mongodb://${process.env.MONGO_IP}`;
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

export class MongoFacade {

	private _client;
	private _db;
    constructor(
		private serverUrl: string = process.env.MONGO_IP,
		private dbName: string = 'you_need'
	) {
		this._client = new MongoClient('mongodb://' + serverUrl);
		this._db = this._client.db(dbName);
    }

	protected updateMany() {

	}

	protected updateOne() {

	}

	protected insertMany() {

	}

	protected insertOne() {

	}

	protected findOne() {

	}

	protected find() {

	}

	protected setCollection(name: string) {

	}

	protected disconnect() {

	}

	protected connect() {

	}

}
