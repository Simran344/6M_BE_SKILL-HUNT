const mongoose = require("mongoose")
let chatSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    receiverId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    senderId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    messages:[{type:String, default:""}],
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("ChatModel", chatSchema)