import {WithId} from "mongodb";

export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image: string;
    servicePrice: number;
    access: boolean;
    accessRights: 'user' | 'administrator' | 'moderator';
}

export interface UserModelFromMongo extends UserModel, WithId<Document> {}