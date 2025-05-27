const EnquiryModel=require("./EnquiryModel")
const { uploadImg } = require("../../utilities/helper")
add=async(req,res)=>{
    let formData = req.body
    let validation=""
    if(!formData.issue){
        validation+="issue is required"
    }
    if(!formData.message){
        validation+="message is required"
    }
    if(!req.file){
        validation+="attachments is required to upload"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
    let total = await EnquiryModel.countDocuments().exec()
    let enquiryObj = new EnquiryModel()
    enquiryObj.issue = formData.issue
    enquiryObj.message = formData.message
    enquiryObj.autoId = total + 1
    enquiryObj.addedById = req.decoded.userId
    try {
        let url = await uploadImg(req.file.buffer)
        enquiryObj.attachFile = url
    }
    catch {
        res.json({
            status: 500,
            success: false,
            message: "error while uploading image"
        })
    }
    enquiryObj.save()
    .then((enquiryData) => {
        res.json({
            status: 200,
            success: true,
            message: "Enquiry Added!!!",
            data: enquiryData
        })
    })
    .catch(() => {
        res.json({
            status: 500,
            success: false,
            message: "Internal SErver Error!!!"
        })
    })
}
}
all=async(req,res)=>{
    let formData = req.body
    let limit=formData.limit
    let currentPage=formData.currentPage
    delete formData.limit
    delete formData.currentPage
    await EnquiryModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    .then(async(EnqData) => {
        if (EnqData.length > 0) {
            let total=await EnquiryModel.countDocuments().exec()
            res.json({
            status: 200,
            success: true,
            total,
            message: "Data fetched",
            data: EnqData
                    })
                } 
                else {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No data found"
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
module.exports={add,all}