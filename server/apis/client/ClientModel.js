const mongoose = require("mongoose")
let clientSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    photo:{type:String, default:"No pic.jpg"},
    companyName:{type:String, default:""},
    contact:{type:Number, default:0},
    country:{type:String, default:""},
    address:{type:String, default:""},
    userId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("ClientModel", clientSchema)