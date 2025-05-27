const jwt=require("jsonwebtoken")
const SECRET=process.env.JWT_secret
module.exports=(req,res, next)=>{
    let token= req.headers.authorization 
    if(!token){
         res.json({
             status:403,
             success:false,
             message:"No token found!!"
         })
    }else{
         jwt.verify(token,SECRET, (err, decoded)=>{
             if(!!err){
                 res.json({
                     status:403,
                     success:false,
                     message:"Token not valid"
                 })
             }else{
                 if(decoded.userType==1){
                    req.decoded=decoded 
                    next()
                 } else{
                     res.json({
                         status:403,
                         success:false,
                         message:"Unauthorized Access!!"
                     })
                 }               
             }
         
         
         })
     }
 }