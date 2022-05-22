const asyncWrapper = require('../../wrappers/asyncWrapper');

module.exports = {
    createConversation: asyncWrapper(async (req, res) => {
        let saveObject = {};
        req.body.Participants.push(res.locals.UserID);
        saveObject.Participants = req.body.Participants;
        const conversationData = await req.app.locals.model.Conversation.findOne(
            { Participants: { $all: req.body.Participants } }
            , '_id Title Type Image Description Participants').exec();
        if(conversationData != null && conversationData != undefined && Object.keys(conversationData).length > 0)
        return res.multipleObject(true, {message : "SUCC.CONT.CONV.CREATE1",data : conversationData});
        let conversation = await req.app.locals.model.Conversation.create(saveObject);
        return res.multipleObject(true, {message : "SUCC.CONT.CONV.CREATE2",data : {_id:conversation._id,Title:conversation.Title,Type:conversation.Type,Image:conversation.Image, Description:conversation.Description, Participants:conversation.Participants}});
    }),
    getConversationsByUser: asyncWrapper(async (req, res) => {
        const conversationData = await req.app.locals.model.Conversation.find({Participants:{$in : req.body.UserID}}, '_id Title Type Image Description Participants').exec();
        return res.multipleArray(true, {message : "SUCC.CONT.CONV.GETALLBYUSER", data : conversationData});
    }),
}
