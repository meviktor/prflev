export default class APIError{
    constructor(errorMessage, httpStatusCode){
        this.errorMessage = errorMessage;
        this.httpStatusCode = httpStatusCode;
    }
}