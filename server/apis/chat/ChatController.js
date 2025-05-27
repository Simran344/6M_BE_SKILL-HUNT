const { uploadImg } = require("../../utilities/helper")
const ChatModel = require("./ChatModel")

add = async(req, res) => {
    let formData = req.body
    let validation=""
    if(!formData.messages){
        validation+="message is required"
    }
    if(!formData.receiverId){
        validation+="receiverId is required"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
    let total = await ChatModel.countDocuments().exec()
    let chatObj = new ChatModel()
    chatObj.messages = formData.messages
    chatObj.autoId = total + 1
    chatObj.receiverId = formData.receiverId
    chatObj.senderId =req.decoded.userId
    chatObj.save()
    .then((chatData) => {
        res.json({
            status: 200,
            success: true,
            message: "Message Sent!!!",
            data: chatData
        })
    })
    .catch(() => {
        res.json({
            status: 500,
            success: false,
            message: "Message not sent!!!"
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
    await ChatModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    .then(async(chatData) => {
        if (chatData.length > 0) {
            let total = await ChatModel.countDocuments().exec()
            res.json({
                status: 200,
                success: true,
                message: "Message fetched",
                chatData
            })
        }
        else {
            res.json({
                status: 404,
                success: false,
                message: "No messages found"
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
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    ChatModel.findOne({_id:formData._id})
    .populate("senderId")
    .populate("receiverId")
    .then((chatData)=>{
        res.json({
            status:200,
            success:true,
            message:"Data found",
            data:chatData
        })
    })
    .catch((error)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error"
        })
    })
}


update=(req,res)=>{
    let formData=req.body
    let validation=""
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
    ChatModel.findOne({_id:formData._id})
    .then(async(chatData)=>{
        if(!chatData){
            res.json({
                status:404,
                success:false,
                message:"Messages not found"
            })
        }
        else{
            if(formData.messages){
                chatData.messages=formData.messages
            }
            chatData.save()
            .then((chatData)=>{
                res.json({
                    status:200,
                    success:true,
                    message:"Message updated",
                    data:chatData
                })
            })
            .catch((err)=>{
                res.json({
                    status:404,
                    success:false,
                    message:"Message is not updated"
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

changeStatus=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData._id){
        validation+="_id is required"
    }
    if(formData.status==null || formData.status==undefined){
        validation+="status is required"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    ChatModel.findOne({_id:formData._id})
    .then((chatData)=>{
        if(!chatData){
            res.json({
                status:404,
                success:false,
                message:"Message not found"
            })
        }
        else{
            chatData.status=formData.status
            chatData.save()
            .then((chatData)=>{
                res.json({
                    status:200,
                    success:true,
                    message:"Status updated successfully",
                    data:chatData
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


module.exports = {add,all,single,update,changeStatus}