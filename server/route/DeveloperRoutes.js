
const DeveloperController=require("../apis/developer/DeveloperController")
const BidController=require("../apis/bid/BidController")
const RatingController=require("../apis/rating/ratingController")
const UploadController=require("../apis/upload/UploadController")

const router=require("express").Router()
const multer=require("multer")
const DevStorage=multer.memoryStorage()

const DevUpload=multer({storage:DevStorage})

router.post("/dev/register",DevUpload.single("photo"),DeveloperController.register)

router.use(require("../middleware/DeveloperTokenChecker"))

router.post("/update",DevUpload.single("photo"),DeveloperController.update)
const BidStorage=multer.memoryStorage()

const BidUpload=multer({storage:BidStorage})

router.post("/bid/add",BidUpload.single("poc"),BidController.add)

router.post("/rating/single",RatingController.single)

const uploadStorage=multer.memoryStorage()

const upUpload=multer({storage:uploadStorage})
router.post("/upload/add",upUpload.single("attachments") ,UploadController.add)
module.exports=router