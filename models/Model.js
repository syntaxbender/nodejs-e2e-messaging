const mongoose = require("mongoose");
const modelObjects = {
    User: require("./User")(mongoose),
    Conversation: require("./Conversation")(mongoose),
    Message: require("./Message")(mongoose)
}
var models = async () => {};
for (let key in modelObjects) {
    let scheme = new mongoose.Schema(
        modelObjects[key].model
    );
    if(modelObjects[key].hooks && Object.keys(modelObjects[key].hooks).length > 0){
        for (let hookKey in modelObjects[key].hooks) {
            modelObjects[key].hooks[hookKey].map(k=>{return scheme[hookKey](...k)});
        }
    }
    models[key] = mongoose.model(
        key,
        scheme
    );

}
module.exports = models;