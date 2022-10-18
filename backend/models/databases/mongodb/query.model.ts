import {Collection, MongoClient} from "mongodb";

export interface QueryModel {
	collection: Collection;
	client: MongoClient;
}
