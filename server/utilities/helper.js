const cloudinary=require("cloudinary").v2

cloudinary.config({
    cloud_name:process.env.CLOUD_name,
    api_key:process.env.API_key,
    api_secret:process.env.API_secret
})

const uploadImg=(fileBuffer,publicId)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream(
            {publicId},
            (error,uploadResult)=>{
                if(error){
                    return reject({error:"Upload failed",details:error});
                }
                else{
                    resolve(uploadResult.secure_url);
                }
            }
        );
        uploadStream.end(fileBuffer)
    })
}
module.exports={uploadImg}
