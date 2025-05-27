const UserModel=require("./UserModel")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const SECRET=process.env.JWT_secret
login=(async(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData.email){
        validation+="email is required"
    }
    if(!formData.password){
        validation+=" password is required"
    }
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
        await UserModel.findOne({email:formData.email})
        .then((userData)=>{
            if(!userData){
                res.json({
                    status:404,
                    success:false,
                    message:"user does not exist"
                })
            }
            else{
                  let result=bcryptjs.compareSync(formData.password,userData.password)
                  
                  if(result){
                    let payload={
                        userId:userData._id,
                        email:userData.email,
                        password:userData.password,
                        userType:userData.userType
                      }
                      let token=jwt.sign(payload,SECRET)
                     res.json({
                        status:200,
                        success:true,
                        message:"Login Successfully",
                        token,
                        data:userData
                     })
                  }
                  else{
                    res.json({
                        status:200,
                        success:false,
                        message:"Invalid credentials"
                    })
                  }
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
})
changePassword=(req,res)=>{
    let formData=req.body 
    let validation=""
    if(!formData.oldPassword){
        validation+="Old Password is required"
    }
    if(!formData.newPassword){
        validation+="New Password is required"
    }
    if(!formData.confirmPassword){
        validation+="Confirm Password is required"
    }
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }else{
        if(formData.newPassword===formData.confirmPassword){
            UserModel.findOne({_id:req.decoded.userId})
            .then((userData)=>{
                let result=bcryptjs.compareSync(formData.oldPassword, userData.password)
                if(result){
                    userData.password=bcryptjs.hashSync(formData.newPassword, 10)
                    userData.save()
                    .then((userData)=>{
                        res.json({
                            status:200,
                            success:true,
                            message:"Password changed successfully!!",
                            data:userData
                        })
                    })
                    .catch((err)=>{
                        res.json({
                            status:500,
                            success:false,
                            message:"Internal server error"
                        })
                    })
                    
                }else{
                    res.json({
                        status:200,
                        success:false,
                        message:"Old Password doesn't match!"
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
        }else{
            res.json({
                status:200,
                success:false,
                message:"New password doesn't match with confirm password"
            })
        }
    }
    
}

module.exports={login, changePassword}