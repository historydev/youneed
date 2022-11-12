
export interface AuthResponseModel {
	error?: any,
	message: {
		email: string,
		first_name: string,
		id: string,
		image: string,
		last_name: string,
		service_price: number,
		exp: number,
		iat: number
	}
}
