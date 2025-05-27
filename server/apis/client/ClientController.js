const { uploadImg } = require("../../utilities/helper")
const UserModel=require("../user/UserModel")
const ClientModel=require("./ClientModel")
const bcryptjs=require("bcryptjs")

register=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData.name){
        validation+="name is required"
    }
    if(!formData.email){
        validation+=" email is required"
    }
    if(!formData.password){
        validation+=" password is required"
    }
    if(!formData.contact){
        validation+=" contact number is required"
    }
    if(!formData.address){
        validation+=" address is required"
    }
    if(!formData.country){
        validation+=" country name is required"
    }
    if(!formData.companyName){
        validation+=" companyName is required"
    }
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
        UserModel.findOne({email:formData.email})
        .then(async(userData)=>{
            console.log("1")
            if(!userData){
                let userObj=new UserModel()
                let total=await UserModel.countDocuments().exec()
                userObj.name=formData.name
                userObj.email=formData.email
                userObj.password=bcryptjs.hashSync(formData.password,10)
                userObj.autoId=total+1
                userObj.userType=2
                userObj.save()
                .then(async(userdata)=>{
                    let total=await ClientModel.countDocuments().exec()
                    let clientObj=new ClientModel()
                    clientObj.contact=formData.contact
                    clientObj.companyName=formData.companyName
                    try{
                        let url=await uploadImg(req.file.buffer)
                        clientObj.photo=url
                    }
                    catch{
                        res.json({
                            status:500,
                            success:false,
                            message:"error while uploading image"
                        })
                    }
                    clientObj.country=formData.country
                    clientObj.address=formData.address
                    clientObj.autoId=total+1
                    clientObj.userId=userdata._id
                    clientObj.save()
                    .then((clientData)=>{
                        res.json({
                            status:200,
                            success:true,
                            message:"Client registered successfully",
                            clientData,
                            userdata
                        })
                    })
                    .catch((err)=>{
                        res.json({
                            status:500,
                            success:false,
                            message:"Internal server error1"
                        })
                    })

                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:"Internal server error2"
                    })
                })
            }
            else{
                res.json({
                    status:200,
                    success:false,
                    message:"Client already exists",
                    
                })
            }
        })
        .catch((err)=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error3",
                error:err
            })
        })
    }
}
all=(async(req,res)=>{
    let formData=req.body
    let limit=formData.limit
    let currentPage=formData.currentPage
    delete formData.limit
    delete formData.currentPage
    await ClientModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    
     .populate("userId")
    .then(async(clientData)=>{
        if(clientData.length>0){
            let total=await ClientModel.countDocuments(formData).exec()
        res.json({
            status:200,
            success:true,
            message:"Data found",
            total:total,
            data:clientData
        })
    }
    else{
        res.json({
            status:403,
            success:false,
            message:"No data found"
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
})
single=(req,res)=>{
        let validation=""
        let formData=req.body
        if(!formData.userId){
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
        ClientModel.findOne({userId:formData.userId})
        .populate("userId")
        .then((clientData)=>{
            res.json({
                status:200,
                success:true,
                message:"Data found",
                data:clientData
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
}
update=(req,res)=>{
    let formData=req.body
    UserModel.findOne({_id:req.decoded.userId})
    .then((userData)=>{
        if(!userData){
            res.json({
                status:404,
                success:false,
                message:"Data not found"
            })
        }
        else{
            if(formData.name){
                userData.name=formData.name
            }
            userData.save()
            .then((userData)=>{
                ClientModel.findOne({userId:req.decoded.userId})
                .then(async(clientData)=>{
                    if(!clientData){
                        res.json({
                            status:404,
                            success:false,
                            message:"Data not found"
                        })
                    }
                    else{
                        if(req.file){
                            try{
                                let url=await uploadImg(req.file.buffer)
                                clientData.photo=url
                            }
                            catch{
                                res.json({
                                    status:500,
                                    success:false,
                                    message:"error while uploading image"
                                })
                            } 
                        }
                        if(formData.companyName){
                            clientData.companyName=formData.companyName
                        }
                        if(formData.contact){
                            clientData.contact=formData.contact
                        }
                        if(formData.country){
                            clientData.country=formData.country
                        }
                        if(formData.address){
                            clientData.address=formData.address
                        }
                        clientData.save()
                        .then((clientData)=>{
                            res.json({
                                status:200,
                                success:true,
                                message:"Data updated Successfully!!!",
                                userData,
                                clientData
                            })
                        })
                        .catch((err)=>{
                            res.json({
                                status:500,
                                success:false,
                                message:err?.message
                            })
                        })
                    }
                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:err?.message
                    })
                })
            })
            .catch((err)=>{
                res.json({
                    status:500,
                    success:false,
                    message:err?.message
                })
            })
        }
    })

}
changeStatus=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData._id){
        validation+="_id is required "
    }
    if(formData.status==null || formData.status==undefined){
        validation+="Status is required"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
    UserModel.findOne({_id:formData._id})
        .then((userData)=>{
            if(!userData){
                res.json({
                    status:404,
                    success:false,
                    message:"Data not found"
                })
            }
            else{
                userData.status=formData.status
                userData.save()
                .then((userData)=>{
                   ClientModel.findOne({userId:formData._id})
                   .then((clientData)=>{
                        if(!clientData){
                            res.json({
                                status:404,
                                success:false,
                                message:"Data not found"
                            })
                        }
                        else{
                            clientData.status=formData.status
                            clientData.save()
                            .then((clientData)=>{
                                res.json({
                                    status:200,
                                    success:true,
                                    message:"status updated successfully",
                                    userData,
                                    clientData
                                })
                            })
                            .catch((err)=>{
                                res.json({
                                    status:500,
                                    success:false,
                                    message:err?.message
                                })
                            })
                        }
                    })
                    .catch((err)=>{
                        res.json({
                            status:500,
                            success:false,
                            message:err?.message
                        })
                    })
                })
                .catch(()=>{
                    res.json({
                        status:404,
                        success:false,
                        message:"status is not updated"
                    })  
                })
            }
        })
        .catch(()=>{
            res.json({
                status:404,
                success:false,
                message:"Internal server error"
            })
        })
    }
}
module.exports={register,all,single, update, changeStatus}