export interface ControllerResponseModel<DataType, ErrorType> {
    message?: DataType | null,
    error?: ErrorType
}
