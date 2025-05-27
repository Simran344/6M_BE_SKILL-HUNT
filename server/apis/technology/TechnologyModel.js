const mongoose = require("mongoose")
let technologySchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    name:{type:String, default:""},
    thumbnail:{type:String, default:"no pic.jpg"},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("TechnologyModel", technologySchema)