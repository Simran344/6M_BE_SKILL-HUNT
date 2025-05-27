const mongoose=require("mongoose")
enquirySchema=mongoose.Schema({
    autoId:{type:Number, default:1},
  
    issue:{type:String, default:""},
    message:{type:String, default:""},
    attachFile:{type:String, default:""},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports=mongoose.model("EnquiryModel", enquirySchema)