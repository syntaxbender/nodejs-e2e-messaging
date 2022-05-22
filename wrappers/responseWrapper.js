module.exports = function(app){

    const multipleArray = function (status=true,result) {
        return this.json({
            status : status,
            type : "multiple-data-array",
            result : result
            //result : {...app.response.locals.middleParams,...result}
        });
    };
    const multipleObject = function (status=true,result) {
        return this.json({
            status : status,
            type : "multiple-data-object",
            result : result
            //result : {...app.response.locals.middleParams,...result}
        });
    };
    const single = function (status=true,result) {
        //if(app.response.locals.middleParams>0) this.multipleObject(true,{result});
        return this.json({
            status : status,
            type : "single-data",
            result : result
        });
    };
    const valErr = function (errors) {
        // rarely from ./middlewares/errorHandler.js
        //  {
        //    status:false,
        //    type:"validation-error"
        //    errors : [
        //      { message: "Bu alan zorunludur.", field: "Username" },
        //      { message: "Bu alan zorunludur.", field: "Password" }
        //    ]
        //  }
        return this.json({
            status : false,
            type : "validation-error",
            errors : errors
        });
    };
    const accessToken = function (token,userID,expDate) {
        return this.json({
            status : true,
            type : "access-token",
            userID : userID,
            token : token,
            expDate : expDate
        });
    };
    return { single,multipleArray,multipleObject,valErr,accessToken };
}