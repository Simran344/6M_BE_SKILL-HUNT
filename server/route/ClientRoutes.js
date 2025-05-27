const ClientController=require("../apis/client/ClientController")
const ProjectController = require("../apis/project/ProjectController")
const BidController = require("../apis/bid/BidController")
const TechnologyController = require("../apis/technology/TechnologyController")
const UploadController=require("../apis/upload/UploadController")
const RatingController = require("../apis/rating/ratingController")
const router=require("express").Router()
const multer=require("multer")
const ClientStorage=multer.memoryStorage()

const ClientUpload=multer({storage:ClientStorage})

router.post("/client/register",ClientUpload.single("photo"),ClientController.register)

//token checker
router.use(require("../middleware/ClientTokenChecker"))


router.post("/update", ClientUpload.single("photo"),ClientController.update)
const projectStorage=multer.memoryStorage()

const projectUpload=multer({storage:projectStorage})


router.post("/bid/changeStatus",BidController.changeStatus)
router.post("/project/add",projectUpload.single("attachments"),ProjectController.add)
router.post("/project/update",ProjectController.update)
router.post("/project/status",ProjectController.changeStatus)

router.post("/rating/add",RatingController.add)
router.post("/rating/delete",RatingController.deletes)
router.post("/upload/all",UploadController.all)
router.post("/bid/pay",BidController.pay)
router.post("/bid/update",BidController.update)
module.exports=router
