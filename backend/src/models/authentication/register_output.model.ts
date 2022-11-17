export interface RegisterOutputModel {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	image: string;
	password: string;
	service_price: number;
	access: boolean;
	access_rights: 'user' | 'administrator' | 'moderator';
}
