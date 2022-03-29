
const bookModel = require('../models/bookModel')
const reviewModel = require("../models/reviewModel")
const validate = require('../validator/validators')


const addReview = async (req, res) => {

    try {

        let reviewData = req.body
        let bookId = req.params.bookId

        let { reviewedBy, rating, review } = reviewData

        if (!validate.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please Enter A valid Book Id" })
        }

        let isBookPresent = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!isBookPresent) {
            return res.status(404).send({ status: false, message: "Book not found, please check Book Id" })
        }

        if (!Object.keys(req.body).includes("reviewedBy")) {
            return res.status(404).send({ status: false, message: "reviewed By is require" })
        }

        if (reviewedBy == "" || reviewedBy == null) {
            reviewedBy = 'Guest'
        }

        if (typeof reviewedBy !== String) {
            return res.status(400).send({ status: false, message: "Please Give a proper Name" })
        }


        if (!rating) {
            return res.status(400).send({ status: false, message: "rating required" })
        }

        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Invalid Rating! , please rate in beetween 1 to 5" })
        }

        if (!validate.isValid(review)) {
            return res.status(400).send({ status: false, message: "Please Enter A Valid Review" })
        }
        let reviewedAt = new Date();

        if (req.body.isDeleted == true) {
            return res.status(400).send({ status: false, message: "No data should be deleted At the time of Creation" })
        }

        const finalData = { bookId, reviewedBy, reviewedAt, rating, review }

        let newReview = await reviewModel.create(finalData)
        console.log(newReview)

        let newData2 = { ...newReview.toObject() }
        delete newData2.createdAt
        delete newData2.updatedAt
        delete newData2.__v

        let checkRevCount = await reviewModel.find({ bookId: bookId, isDeleted: false }).select(updatedAt = 0, createdAt = 0)
        let count = checkRevCount.length

        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { reviews: count } }, { new: true })

        return res.status(201).send({
            status: true, message: "Success",
            Data: { ...updatedBook.toObject(), reviewsData: [newData2] }
        })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}

module.exports.addReview = addReview