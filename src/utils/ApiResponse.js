class ApiResponse{
    constructor(data=null,statusCode){
        this.data= data,
        this.statusCode=statusCode,
        this.succes = statusCode<400,
        this.message = "success"
    }
}

export default ApiResponse;