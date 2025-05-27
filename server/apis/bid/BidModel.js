const mongoose = require("mongoose")
let bidSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    clientId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    projectId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"ProjectModel"},
    bidAmount:{type:String, default:""},
    poc:{type:String, default:""},
    details:{type:String, default:""},
    duration:{type:String, default:""},
    paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
    status:{type:Number, default:1}, ///1->Pending, 2->approve, 3->decline
    createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("BidModel", bidSchema)