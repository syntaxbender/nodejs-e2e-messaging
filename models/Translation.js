//const mongoose = require("mongoose");
const BaseModel = require("./BaseModel"); 
let Translation = {};
Translation.model = {
    ...BaseModel,
    Descriptor: {
        type: String,
        required: true,
    },
    Turkish: {
        type: String,
        required: true
    },
    English: {
        type: String,
        required: true
    }
}
module.exports = Translation;
