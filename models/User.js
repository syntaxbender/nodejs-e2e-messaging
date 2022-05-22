//const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const BaseModel = require("./Base"); 

module.exports = function(mongoose){
    const User = {
        model:{
            ...BaseModel,
            Email: {
                type: String,
                required: [true, 'ERR.VAL.MODEL.USER.EMAIL.REQ'],
                unique: true,
                validate: {
                    validator: (str) => Promise.resolve(/^.+@.+\..+$/.test(str)),
                    message : 'ERR.VAL.MODEL.USER.EMAIL.REGEX'
                    //message: props => `${props.value} prop degeri ile cikti`
                }
            },
            Username : {
                type: String,
            },
            Image : {
                type: String,
                default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            },
            Biography: {
                type: String,
                default: "Hi there, I'm using eventset.io!"
            },
            LastActivity: {
                type: Date,
            },
            Conversations: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Conversation"
                }
            ],
            Password: {
                type: String,
                required: true,
            }
        },
        hooks:{
            pre:[['save', async function(next) {
                if(this.Password) {
                    this.Password = await bcrypt.hashSync(this.Password, 10)
                }
                next();
            }]],
            post:[['init', async function() {
                
                if(this.Username == "" || this.Username == null){
                    this.Username = this.Email;
                }
                /*if(this.Biography == "" || this.Biography == null){
                    this.Biography = "Hi there, I'm using eventset.io!";
                }
                if(this.Image == "" || this.Image == null){
                    this.Image = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                }*/
                
            }]]
        }
    }
    return User;
}
