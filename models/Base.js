const BaseModel = {
    CreatedTimestamp:{
        type:Date,
        required:true,
        default:Date.now()
    },
    ModifiedTimestamp:{
        type:Date,
        required:true,
        default:Date.now()
    },
    CreatedBy:{
        type:String,
        //reqired:false
    },
    IpAddress:{
        type:String,
        //reqired:true
    }
}
module.exports = BaseModel;
