const UserModel = require("../user/UserModel")
const DeveloperModel = require("./DeveloperModel")
const bcryptjs = require("bcryptjs")
const { uploadImg } = require("../../utilities/helper")
const RatingModel = require("../rating/ratingModel")
register = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData.name) {
        validation += "name is required"
    }
    if (!formData.email) {
        validation += " email is required"
    }
    if (!formData.password) {
        validation += " password is required"
    }
    if (!formData.contact) {
        validation += " contact number is required"
    }
    if (!req.file) {
        validation += " photo is required"
    }
    if (!formData.technologyId) {
        validation += "TechnologyId is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {

        UserModel.findOne({ email: formData.email })
            .then(async (userData) => {
                if (!userData) {
                    let userObj = new UserModel()
                    let total = await UserModel.countDocuments().exec()
                    userObj.name = formData.name
                    userObj.email = formData.email
                    userObj.password = bcryptjs.hashSync(formData.password, 10)
                    userObj.autoId = total + 1
                    userObj.userType = 3
                    userObj.save()
                        .then(async (userData) => {
                            let total = await DeveloperModel.countDocuments().exec()
                            let devObj = new DeveloperModel()
                            try {
                                let url = await uploadImg(req.file.buffer)
                                devObj.photo = url
                            }
                            catch {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "error while uploading image"
                                })
                            }

                            devObj.contact = formData.contact
                            devObj.autoId = total + 1
                            devObj.userId = userData._id
                            devObj.technologyId = formData.technologyId
                            devObj.save()
                                .then((developerData) => {
                                    res.json({
                                        status: 200,
                                        success: true,
                                        message: "Developer registered successfully",
                                        developerData,
                                        userData
                                    })
                                })
                                .catch((err) => {
                                    res.json({
                                        status: 500,
                                        success: false,
                                        message: "Internal server error"
                                    })
                                })

                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error"
                            })
                        })
                }
                else {
                    res.json({
                        status: 200,
                        success: false,
                        message: "Developer already exists",
                        data: userData
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
}
all = (async (req, res) => {
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    await DeveloperModel.find(formData)
        .limit(limit)
        .skip((currentPage - 1) * limit)

        .populate("userId")
        .then(async(devData) => {
            if (devData.length > 0) {
                let total=await DeveloperModel.countDocuments(formData).exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Data fetched",
                    total,
                    data: devData
                })
            } else {
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
})
single = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData.userId) {
        validation += "userid is required"
    }
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        DeveloperModel.findOne({ userId: formData.userId})
            .populate("userId")
            .then((devData) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Data found",
                    data: devData
                })
            })
            .catch((error) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error"
                })
            })
    }
}
update = (req, res) => {
    let formData = req.body
    UserModel.findOne({ _id: req.decoded.userId })
        .then((userData) => {
            if (!userData) {
                res.json({
                    status: 404,
                    success: false,
                    message: "Data not found"
                })
            }
            else {
                if (formData.name) {
                    userData.name = formData.name
                }
                userData.save()
                    .then((userData) => {
                        DeveloperModel.findOne({ userId: req.decoded.userId })
                            .then(async (devData) => {
                                if (!devData) {
                                    res.json({
                                        status: 404,
                                        success: false,
                                        message: "Data not found"
                                    })
                                }
                                else {
                                    if (req.file) {
                                        try {
                                            let url = await uploadImg(req.file.buffer)
                                            devData.photo = url
                                        }
                                        catch {
                                            res.json({
                                                status: 500,
                                                success: false,
                                                message: "error while uploading image"
                                            })
                                        }
                                    }
                                    if (formData.contact) {
                                        devData.contact = formData.contact
                                    }
                                    devData.save()
                                        .then((devData) => {
                                            res.json({
                                                status: 200,
                                                success: true,
                                                message: "Data updated Successfully!!!",
                                                userData,
                                                devData
                                            })
                                        })
                                        .catch((err) => {
                                            res.json({
                                                status: 500,
                                                success: false,
                                                message: err?.message
                                            })
                                        })
                                }
                            })
                            .catch((err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: err?.message
                                })
                            })
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: err?.message
                        })
                    })
            }
        })

}
changeStatus = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData._id) {
        validation += "_id is required "
    }
    if (formData.status == null || formData.status == undefined) {
        validation += "Status is required"
    }
    if (validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        UserModel.findOne({ _id: formData._id })
            .then((userData) => {
                if (!userData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Data not found"
                    })
                }
                else {
                    userData.status = formData.status
                    userData.save()
                        .then((userData) => {
                            DeveloperModel.findOne({ userId: formData._id })
                                .then((devData) => {
                                    if (!devData) {
                                        res.json({
                                            status: 404,
                                            success: false,
                                            message: "Data not found"
                                        })
                                    }
                                    else {
                                        devData.status = formData.status
                                        devData.save()
                                            .then((devData) => {
                                                res.json({
                                                    status: 200,
                                                    success: true,
                                                    message: "status updated successfully",
                                                    userData,
                                                    devData
                                                })
                                            })
                                            .catch((err) => {
                                                res.json({
                                                    status: 500,
                                                    success: false,
                                                    message: err?.message
                                                })
                                            })
                                    }
                                })
                                .catch((err) => {
                                    res.json({
                                        status: 500,
                                        success: false,
                                        message: err?.message
                                    })
                                })
                        })
                        .catch(() => {
                            res.json({
                                status: 404,
                                success: false,
                                message: "status is not updated"
                            })
                        })
                }
            })
            .catch(() => {
                res.json({
                    status: 404,
                    success: false,
                    message: "Internal server error"
                })
            })
    }
}
module.exports = { register, all, single, update, changeStatus }