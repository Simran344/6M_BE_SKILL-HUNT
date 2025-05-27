const { uploadImg } = require("../../utilities/helper")
const TechnologyModel = require("./TechnologyModel")

add = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData.name) {
        validation += "Name is required"
    }
    if(!req.file){
        validation+=" Thumbnail is required!!!"
    }
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        TechnologyModel.findOne({ name: formData.name })
            .then(async (techData) => {
                if (!techData) {
                    let total = await TechnologyModel.countDocuments().exec()
                    let techObj = new TechnologyModel()
                    techObj.name = formData.name
                    try{
                        let url=await uploadImg(req.file.buffer)
                        techObj.thumbnail=url
                    }
                    catch(err){
                        res.json({
                            status:500,
                            success:false,
                            message:"error while uploading thumbnail"
                        })
                    }
                    techObj.autoId = total + 1
                    techObj.save()
                        .then((techData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Technology added",
                                data: techData
                            })
                        })
                        .catch(() => {
                            res.json({
                                status: 404,
                                success: false,
                                message: "Technology not added"
                            })
                        })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Technology already exists with same name"
                    })
                }
            })
            .catch((err) => {
                res.json({
                    status: 404,
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
        await TechnologyModel.find(formData)
        .limit(limit)
        .skip((currentPage-1)*limit)
        .then(async(techData) => {
            if (techData.length > 0) {
                let total = await TechnologyModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Technology fetched",
                    total: total,
                    data: techData
                })
            }
            else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No technology found"
                    
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
            success:false,
            message:validation
        })
    }
    else{
        TechnologyModel.findOne({_id:formData._id})
        
        .then((techData)=>{
            res.json({
                status:200,
                success:true,
                data:techData
            })
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
        TechnologyModel.findOne({_id:formData._id})
        .then(async(techData)=>{
            if(!techData){
                res.json({
                    status:404,
                    success:false,
                    message:"Technology not found"
                })
            }
            else{
                if(formData.name){
                    techData.name=formData.name
                }
                if(req.file){
                    try{
                        let url=await uploadImg(req.file.buffer)
                        techData.thumbnail=url
                    }
                    catch(err){
                        res.json({
                            status:500,
                            success:false,
                            message:"error while uploading thumbnail"
                        })
                    }
                }
                techData.save()
                .then((techData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Technology data is updated",
                        data:techData
                    })
                })
                .catch((err)=>{
                    res.json({
                        status:404,
                        success:false,
                        message:"Technology data is not updated"
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
changeStatus=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData._id){
        validation+="_id is required"
    }
    if(formData.status==null||formData.status==undefined){
        validation+="status is required"
    }
    if(!!validation.trim()){
          res.json({
              status:422,
              success:false,
              message:validation
          })
    }
    else{
        TechnologyModel.findOne({_id:formData._id})
        .then((techData)=>{
            if(!techData){
                res.json({
                    status:404,
                    success:false,
                    message:"Techology not found"
                })
            }
            else{
                techData.status=formData.status
                techData.save()
                .then((techData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"status updated successfully",
                        data:techData
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

module.exports = {add,all,single,update,changeStatus}