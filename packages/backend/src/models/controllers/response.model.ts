export interface ControllerResponseModel<DataType, ErrorType> {
	data?: DataType | null,
	error?: ErrorType
}
