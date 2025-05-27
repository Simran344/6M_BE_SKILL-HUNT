const { uploadImg } = require("../../utilities/helper")
const UploadModel=require("./UploadModel")

add=async(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData.remarks){
        validation+="remarks is required"
    }
    if(!formData.projectId){
        validation+=" projectId is required"
    }
    if(!formData.clientId){
        validation+=" clientId is required"
    }
    if(!req.file){
        validation+=" attachments is required"
    }
    else{
     let total = await UploadModel.countDocuments().exec()
        let uploadObj = new UploadModel()
       
        uploadObj.autoId = total + 1
       uploadObj.remarks=formData.remarks
       uploadObj.projectId=formData.projectId
       uploadObj.addedById=req.decoded.userId
       uploadObj.clientId=formData.clientId
       try{
        let url=await uploadImg(req.file.buffer)
        uploadObj.attachments=url
       }
       catch{
        res.json({
            status: 500,
            success: false,
            message: "error while uploading image"
        })
       }
       uploadObj.save()
        .then((uploadData) => {
            res.json({
                status: 200,
                success: true,
                message: "Task Uploaded!!!",
                data: uploadData
            })
        })
        .catch(() => {
            res.json({
                status: 500,
                success: false,
                message: "Task not uploaded!!!"
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
        await UploadModel.find(formData)
        .populate("addedById")
        .populate("clientId")
        .populate("projectId")
        .limit(limit)
        .skip((currentPage-1)*limit)
        .then(async(uploadData) => {
            if (uploadData.length > 0) {
                let total = await UploadModel.countDocuments(formData).exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Task fetched",
                    total: total,
                    data:uploadData
                })
            }
            else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Task not found"
                    
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
    
module.exports={add,all}