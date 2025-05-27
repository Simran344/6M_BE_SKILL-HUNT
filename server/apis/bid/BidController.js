const { uploadImg } = require("../../utilities/helper")
const BidModel = require("./BidModel")
const Razorpay = require('razorpay');
add = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData.bidAmount) {
        validation += "BidAmount is required"
    }
    if (!req.file) {
        validation += " POC is required"
    }
    if (!formData.duration) {
        validation += " Duration is required"
    }
    if (!formData.details) {
        validation += " Details is required"
    }
    if(!formData.clientId){
        validation+=" clientId is required"
    }
    if(!formData.projectId){
        validation+= "projectId is required"
    }
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        BidModel.findOne({addedById:req.decoded.userId, clientId:formData.clientId, projectId:formData.projectId})
            .then(async (bidData) => {
                if (!bidData) {
                    let total = await BidModel.countDocuments().exec()
                    let bidObj = new BidModel()
                    try{
                        let url=await uploadImg(req.file.buffer)
                        bidObj.poc=url
                    }
                    catch(err){
                        res.json({
                            status:500,
                            success:false,
                            message:"error while uploading poc"
                        })
                    }
                    bidObj.autoId = total + 1
                    bidObj.addedById = req.decoded.userId
                    bidObj.clientId =formData.clientId
                    bidObj.projectId = formData.projectId
                    bidObj.bidAmount = formData.bidAmount
                    bidObj.duration = formData.duration
                    bidObj.details = formData.details
                    bidObj.save()
                        .then((bidData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Bid added",
                                data: bidData
                            })
                        })
                        .catch(() => {
                            res.json({
                                status: 404,
                                success: false,
                                message: "Bid not added"
                            })
                        })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Project already exists with same name"
                    })
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error"
                })
            })
    }
}
all=async(req, res)=>{
    let formData = req.body
    let limit=formData.limit
    let currentPage=formData.currentPage
    delete formData.limit
    delete formData.currentPage
    await BidModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    .populate("addedById")
    .populate("clientId")
    .populate("projectId")
        .then(async(bidData) => {
            if (bidData.length > 0) {
                let total = await BidModel.countDocuments(formData).exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Bid fetched",
                    total: total,
                    bidData
                })
            }
            else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No Bid found"
                })
            }
        })
        .catch ((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error"
            })
        })
}
single=(req,res)=>{
   let formData=req.body
   let validation=""
   if(!formData._id){
         validation+="_id is required"
   }
   if(!!validation.trim()){
        res.json({
            status:422,
            success:true,
            message:"Validation error"
        })
   }
   else{
    BidModel.findOne({_id:formData._id})
    .populate("addedById")
    .populate("clientId")
    .populate("projectId")
    .then((bidData)=>{
        if(!bidData){
            res.json({
                status:404,
                success:false,
                message:"No Data Found"
            })
        }
        else{
            res.json({
                status:200,
                success:true,
                message:"Data Fetched",
                data:bidData
            })
        }
    })
    .catch((err)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error"
        })
    })
   }
}
changeStatus=(req,res)=>{
      let formData=req.body
      let validation=""
      if(!formData._id){
        validation+="_id is required"
      }
      if(!formData.projectId){
        validation+=" projectId is required"
      }
      if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
      }
      else{
        BidModel.findOne({_id:formData._id})
        .then((bidData)=>{
            if(!bidData){
                res.json({
                    status:404,
                    success:false,
                    message:"Bid not found"
                })
            }
            else{
                bidData.status=formData.status
                bidData.save()
                .then(async(bidData)=>{
                    if(bidData.status==2){
                     let arr= await BidModel.find()
                     console.log(arr)
                     let arr1=arr.filter((ele,index)=>{
                        if(ele._id!=formData._id && ele.projectId==formData.projectId){
                            return ele
                        }
                     })
                     console.log(arr1)
                     for(let i=0;i<arr1.length;i++){
                        arr1[i].status=3
                        arr1[i].save()
                     }   
                    }
                    bidData.save()
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:bidData
                    })
                })
                .catch(()=>{
                    res.json({
                        status:404,
                        success:false,
                        message:"Status is not updated"        
                    })   
                })
            }
        })
        .catch(()=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error"
            })
        })
    }
}
update=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData._id){
        validation+="_id is required"
    }
    if(!!validation.trim()){
          res.json({
              status:422,
              success:false,
              message:validation
          })
    }
    else{
        BidModel.findOne({_id:formData._id})
        .then(async(bidData)=>{
            if(!bidData){
                res.json({
                    status:404,
                    success:false,
                    message:"Bid not found"
                })
            }
            else{
                if(formData.status){
                    bidData.status=formData.status
                }
                
                bidData.save()
                .then((bidData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Bid data is updated",
                        data:bidData
                    })
                })
                .catch((err)=>{
                    res.json({
                        status:404,
                        success:false,
                        message:"Bid data is not updated"
                    })
                })
            }
        })
        .catch(()=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error"
            })
        })
    }
}
pay = (req,res)=>{
        let validation=""
        let formData=req.body
        if(!formData._id){
                validation+="_id is required"
        }
        if(validation.trim()){
             res.json({
            status:422,
            success:false,
            message:validation
        })
    }      
        else{
                BidModel.findOne({_id:formData._id})
                .then(async(bidData)=>{
                    // console.log("product data is",productdata);
                    if(bidData == null){
                        res.send({
                            status:404,
                            success:false,
                            message:"data not found"
                        })
                    }
                    else{
                        const razorpay = new Razorpay({
                           key_id: 'rzp_test_81m41n13O8OvjC',
                            key_secret: '0yEv1mJbIxS9SowEyrJ1DtTK'
                           
                        });
                        const options = {
                            amount: bidData.bidAmount * 100, // price should be in paise
                            currency: "INR",
                            receipt: "receipt_order_" + Date.now()
                        };
                        const order = await razorpay.orders.create(options);
                        bidData.paymentStatus = "paid"
                        bidData.save()
                        .then((updateddata)=>{
                            res.send({
                                status:200,
                                order,
                                success:true,
                                message:"Razorpay order created",
                                data:updateddata
                            })
                        })
                        .catch((err)=>{
                            res.send({
                                status:500,
                                success:false,
                                message:"Internel server error",
                                errMsg :err
                            })
                        })
                        
                
                
                    }
                })
                .catch((err)=>{
                    res.send({
                        status:500,
                        success:false,
                        message:"Internel server error",
                        errMsg :err
                    })
                })

        }

}
module.exports = {add,all,single,changeStatus,pay, update}