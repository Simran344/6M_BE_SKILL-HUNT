const mongoose = require("mongoose")
let userSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    name:{type:String, default:""},
    email:{type:String, default:""},
    password:{type:String, default:""},
    userType:{type:Number, default:2}, //1->Admin,2->Client,3->Developer
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})
module.exports = mongoose.model("UserModel", userSchema)