module.exports = function(mongoose){
    const BaseModel = require("./Base");
    let Message = {}; 
    Message.model = {
        ...BaseModel,
        Conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation"
        },
        From: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        Message: {
            type: String,
            required: [true, 'ERR.VAL.MODEL.MESSAGE.MESSAGE.REQ']
        }
    };
    return Message;
}