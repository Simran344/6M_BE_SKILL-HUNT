const ClientController = require("../apis/client/ClientController")
const DeveloperController = require("../apis/developer/DeveloperController")
const TechnologyController = require("../apis/technology/TechnologyController")
const ChatController = require("../apis/chat/ChatController")
const EnquiryController = require("../apis/enquiry/EnquiryController")
const router=require("express").Router()
const multer=require("multer")
router.use(require("../middleware/AdminTokenChecker"))

router.post("/client/status", ClientController.changeStatus)

router.post("/developer/status", DeveloperController.changeStatus)

const TechStorage=multer.memoryStorage()

const TechUpload=multer({storage:TechStorage})
router.post("/technology/add",TechUpload.single("thumbnail"),TechnologyController.add)
router.post("/technology/update",TechUpload.single("thumbnail"),TechnologyController.update)
router.post("/technology/status",TechnologyController.changeStatus)

router.post("/chat/all",ChatController.all)
router.post("/chat/status",ChatController.changeStatus)

router.post("/enquiry/all", EnquiryController.all)
module.exports=router