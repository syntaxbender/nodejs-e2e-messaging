module.exports = function(mongoose){
    const BaseModel = require("./Base"); 
    let Conversation = {
        model:{
            ...BaseModel,
            Title: {
                type: String,
                //required: [true, 'ERR.VAL.MODEL.CONVERSATION.TITLE.REQ'],
            },
            Type:{
                type: String,
                //required: true,
                //default : function(){ return ((this.Participants.length>2) ? "group" : "private") },
                enum:["private","group"],
                description: "ERR.VAL.MODEL.CONVERSATION.TYPE.ENUM"
            },
            Image: {
                type: String,
            },
            Description: {
                type: String,
            },
            Messages:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Message"
                }
            ],
            Participants: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        },
        hooks:{
            pre:[['save', async function(next) {
                this.Type = (this.Participants.length>2) ? "group" : "private";
                next();
            }]]
        }
    };
    return Conversation;
}