import {UserModel} from "./user.model";

export interface UsersResponseModel {
	error?: any;
	message: UserModel[];
}
