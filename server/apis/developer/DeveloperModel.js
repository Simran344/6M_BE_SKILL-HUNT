const mongoose = require("mongoose")
let developerSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    photo:{type:String, default:"No pic.jpg"},
    contact:{type:Number, default:0},
    technologyId:[{type:mongoose.Schema.Types.ObjectId, default:null, ref:"TechnologyModel"}],
    ratings:{type:Number,default:3},
    userId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("DeveloperModel", developerSchema)