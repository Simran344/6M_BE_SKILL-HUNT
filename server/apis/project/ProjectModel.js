const mongoose = require("mongoose")
let projectSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    technologyId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"TechnologyModel"},
    title:{type:String, default:""},
    budget:{type:String, default:""},
    duration:{type:String, default:""},
    attachments:{type:String, default:"no-pic.jpg"},
    description:{type:String, default:""},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("ProjectModel", projectSchema)