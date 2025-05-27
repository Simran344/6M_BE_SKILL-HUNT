const UserController=require("../apis/user/UserController")
const ClientController = require("../apis/client/ClientController")
const DeveloperController = require("../apis/developer/DeveloperController")
const BidController = require("../apis/bid/BidController")
const ProjectController = require("../apis/project/ProjectController")
const TechnologyController = require("../apis/technology/TechnologyController")
const ChatController = require("../apis/chat/ChatController")
const EnquiryController = require("../apis/enquiry/EnquiryController")
const RatingController=require("../apis/rating/ratingController")
const multer=require("multer")
const router=require("express").Router()

//token checker
router.post("/user/login",UserController.login)
//token checker
router.use(require("../middleware/TokenChecker"))
router.post("/user/password/change", UserController.changePassword)
router.post("/client/single", ClientController.single)
router.post("/client/all", ClientController.all)


router.post("/developer/single", DeveloperController.single)
router.post("/developer/all", DeveloperController.all)

const BidStorage=multer.memoryStorage()

const BidUpload=multer({storage:BidStorage})

router.post("/bid/all",BidController.all)

router.post("/bid/single",BidController.single)

router.post("/single",ClientController.single)

router.post("/project/single",ProjectController.single)
router.post("/project/all",ProjectController.all)

router.post("/tech/single",TechnologyController.single)
router.post("/tech/all",TechnologyController.all)

router.post("/chat/add",ChatController.add)
router.post("/chat/single",ChatController.single)
router.post("/chat/update",ChatController.update)
router.post("/single",ClientController.single)
router.post("/rating/all", RatingController.all)

const EnquiryStorage=multer.memoryStorage()

const EnquiryUpload=multer({storage:EnquiryStorage})
router.post("/enquiry/add", EnquiryUpload.single("attachFile"), EnquiryController.add)
module.exports=router
