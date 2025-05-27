const mongoose=require("mongoose")
ratingSchema=mongoose.Schema({
    autoId:{type:Number, default:1},
    rating:{type:Number, default:0},
    projectId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"ProjectModel"},
    developerId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"DeveloperModel"},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports=mongoose.model("RatingModel", ratingSchema)