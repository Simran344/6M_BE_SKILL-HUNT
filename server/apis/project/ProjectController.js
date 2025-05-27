const { uploadImg } = require("../../utilities/helper")
const BidModel = require("../bid/BidModel")
const ProjectModel = require("./ProjectModel")

add = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData.title) {
        validation += "Title is required"
    }
    if (!formData.budget) {
        validation += " Budget is required"
    }
    if (!formData.duration) {
        validation += " Duration is required"
    }
    if (!formData.description) {
        validation += " Description is required"
    }
    if(!formData.technologyId){
        validation+=" technology id is required"
    }
    if(!req.file){
        validation+=" Attachment is required!!!"
    }
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        ProjectModel.findOne({addedById:req.decoded.userId,title:formData.title, technologyId:formData.technologyId})
            .then(async (projectData) => {
                if (!projectData) {
                    let total = await ProjectModel.countDocuments().exec()
                    let projectObj = new ProjectModel()
                    projectObj.title = formData.title
                    try{
                        let url=await uploadImg(req.file.buffer)
                        projectObj.attachments=url
                    }
                    catch(err){
                        res.json({
                            status:500,
                            success:false,
                            message:"error while uploading attachments"
                        })
                    }
                    projectObj.autoId = total + 1
                    projectObj.addedById = req.decoded.userId
                    projectObj.technologyId = formData.technologyId
                    projectObj.budget = formData.budget
                    projectObj.duration = formData.duration
                    projectObj.description = formData.description
                    projectObj.save()
                        .then((projectData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Project added",
                                data: projectData
                            })
                        })
                        .catch(() => {
                            res.json({
                                status: 404,
                                success: false,
                                message: "Project not added"
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
    await ProjectModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    .populate("addedById")
    .populate("technologyId")
        .then(async(projectData) => {
            if (projectData.length > 0) {
                let total = await ProjectModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Project fetched",
                    total: total,
                    projectData
                })
            }
            else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No project found"
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
    else{
        ProjectModel.findOne({_id:formData._id})
        .populate("addedById")
        .then((projectData)=>{
            res.json({
                status:200,
                success:true,
                data:projectData
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
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
        ProjectModel.findOne({_id:formData._id})
        .then(async(projectData)=>{
            if(!projectData){
                res.json({
                    status:404,
                    success:false,
                    message:"Project not found"
                })
            }
            else{
                if(formData.budget){
                    projectData.budget=formData.budget
                }
                if(formData.duration){
                    projectData.duration=formData.duration
                }
                projectData.save()
                .then((projectData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Project data is updated",
                        data:projectData
                    })
                })
                .catch((err)=>{
                    res.json({
                        status:404,
                        success:false,
                        message:"Project data is not updated"
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
    if(formData.status==null ||formData.status==undefined){
        validation+="Status is required"
    }
    if(!formData.bidId){
        validation+="bidId is required"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
      else{
        BidModel.findOne({_id:formData.bidId})
        .then((bidData)=>{
               ProjectModel.findOne({_id:bidData.projectId})
               .then((projectData)=>{
                if(!projectData){
                    res.json({
                        status:404,
                        success:false,
                        message:"Project not found"
                    })
                }
                else{
                    projectData.status=formData.status
                projectData.save()
                .then((projectData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:projectData
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

module.exports = {add,all,single,update,changeStatus}