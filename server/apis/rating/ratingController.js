const DeveloperModel = require("../developer/DeveloperModel")
const RatingModel=require("./ratingModel")
const ProjectModel=require("../project/ProjectModel")
add=async(req,res)=>{
    let formData = req.body
    let validation=""
    if(!formData.rating){
        validation+="ratings is required"
    }
    if(!formData.projectId){
        validation+="projectId is required"
    }
    if(!formData.developerId){
        validation+="developerId is required"
    }
    if(validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
        RatingModel.findOne({addedById:req.decoded.userId,developerId:formData.developerId,projectId:formData.projectId})
        .then(async(ratingData)=>{
            if(!ratingData){
                let total = await RatingModel.countDocuments().exec()
                let ratingObj = new RatingModel()
                ratingObj.rating = formData.rating
                ratingObj.autoId = total + 1
                ratingObj.addedById = req.decoded.userId
                ratingObj.projectId = formData.projectId
                ratingObj.developerId = formData.developerId
                
                ratingObj.save()
                .then(async(ratingData) => {
                    let total=0;
                    let count=0;
                    let arr=await RatingModel.find({developerId:formData.developerId})
                    console.log(arr)
                    for(let i=0;i<arr.length;i++){
                        total+=arr[i].rating;
                        count++;
                    }
                    DeveloperModel.findOne({userId:formData.developerId})
                    .then(async(devData)=>{
                        if(!devData){
                            res.json({
                                status:404,
                                success:false,
                                message:"Developer not found"
                            })
                        }
                        else{
                            devData.ratings=Math.round((total/count)*10)/10
                            await devData.save()
                        }
                    })
                    
                    ratingData.save()
                    res.json({
                        status: 200,
                        success: true,
                        message: "Rating Added!!!",
                        data: ratingData
                    })
                })
            }
            else{
                res.json({
                    status:500,
                    success:true,
                    message:"Rating already gaven to developer"
                })
            }
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
single = (req, res) => {
            let formData = req.body
    let validation = ""
    if (!formData.developerId) {
        validation += "developerId is required"
    }
   
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else{
            RatingModel.findOne({developerId:formData.developerId})
            .populate("addedById")
            .populate({
    path: "developerId",
    populate: {
      path: "userId" // populate inside the developer model
    }
  })
            
            .then((ratingData)=>{
                res.json({
                    status:200,
                    success:true,
                    message:"Data found",
                    data:ratingData
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

all=(req, res)=>{
    let formData = req.body
    
     let limit=formData.limit
        let currentPage=formData.currentPage
        delete formData.limit
        delete formData.currentPage
        RatingModel.find(formData)
        .populate("addedById")
        .populate({
    path: "developerId",
    populate: {
      path: "userId" // populate inside the developer model
    }
  })
         .populate("projectId")
        .limit(limit)
        .skip((currentPage-1)*limit)
    .then(async(ratingData) => {
        if (ratingData.length > 0) {
            let total = await RatingModel.countDocuments(formData).exec()
            res.json({
                status: 200,
                success: true,
                message: "Rating fetched",
                total,
                ratingData
            })
        }
        else {
            res.json({
                status: 404,
                success: false,
                message: "No ratings found"
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

deletes=(req,res)=>{
    let formData=req.body
    RatingModel.findOne({addedById:req.decoded.userId})
    .then((ratingData)=>{
        if(!ratingData){
            res.json({
                status:404,
                success:false,
                message:"No ratings found"
            })
        }
        else{
            RatingModel.deleteOne({_id:formData._id})
            .then(()=>{
                res.json({
                    status:200,
                    success:true,
                    message:"Ratings deleted successfully!!!"
                })
            })
            .catch((err)=>{
                res.json({
                    status:404,
                    success:false,
                    message:"Ratings not deleted"
                })
            })
        }
    })
    .catch((err)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal Server Error!!!"
        })
    })
}

module.exports={add, all, deletes,single}