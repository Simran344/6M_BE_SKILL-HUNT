const mongoose = require("mongoose")
let uploadschema = mongoose.Schema({
    autoId:{type:Number, default:1},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    projectId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"ProjectModel"},
    clientId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    remarks:{type:String,default:""},
    attachments:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}

})
module.exports=mongoose.model("UploadModel",uploadschema)
