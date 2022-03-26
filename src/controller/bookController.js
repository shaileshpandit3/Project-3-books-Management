

const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const validate = require('../validator/validators')
const reviewModel = require('../models/reviewModel')

const createBook = async (req, res) => {

    try {
        let bookData = req.body

        if (!validate.isValidRequestBody(bookData)) {
            return res.status(400).send({ status: false, message: "Invalid Parameters" })
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews } = req.body

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "title Is Required" })
        }

        if (!validate.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt Is Requird" })
        }

        if (!validate.isValid(userId)) {
            return res.status(400).send({ status: false, message: "User Id required!" })
        }

        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid User Id!" })
        }

        const ifUserExist = await userModel.findById(userId)
        if (!ifUserExist) {
            return res.status(404).send({ status: false, message: "User Not Found, Please Check User Id" })
        }

        if (!validate.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Invalid ISBN Enterd" })
        }

        if (!validate.isValid(category)) {
            return res.status(400).send({ status: false, message: "Category Is Required" })
        }

        if (!validate.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory Is Required" })
        }

        if (reviews) {
            if (typeof reviews !== 'number') {
                return res.status(400).send({ status: false, message: "Unexpected Input" })
            }
        }

        if (req.body.isDeleted === true) {
            return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
        }

        const newBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: "Success", Data: newBook })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }

};

module.exports.createBook = createBook

//===========================================================================================


const getBook = async function (req, res) {
    try {
        if (Object.keys(req.query).length == 0) {
            let result = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, review: 1 })
            if (result.length != 0) {
                result.sort(function (a, b) {
                    if (a.title < b.title) return -1
                    if (a.title > b.title) return 1
                    if (a.title = b.title) return 0
                })
                return res.status(200).send({ status: true, data: result })
            }
            return res.status(404).send({ status: false, msg: "No book found" })
        }

        let bookKeys = ["userId", "category", "subCategory"]
        for (let i = 0; i < Object.keys(req.query).length; i++) {
            let keyPresent = bookKeys.includes(Object.keys(req.query)[i])
            if (!keyPresent)
                return res.status(400).send({ status: false, msg: "Wrong Key present" })
        }

        let filterDetails = req.query;
        filterDetails.isDeleted = false;

        let result = await bookModel.find(filterDetails).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, review: 1 })
        if (result.length != 0) {
            result.sort(function (a, b) {
                if (a.title < b.title) return -1
                if (a.title > b.title) return 1
                if (a.title = b.title) return 0
            })
            return res.status(200).send({ status: true, data: result });
        }

        return res.status(404).send({ status: false, msg: " No book data found" })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.getBook = getBook


// ================================================================================================



const getBookWithreview = async (req, res) => {

    try {

        let tempbook = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (tempbook) {

            let reviews = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false })
            let reviewCount = reviews.length

            if (reviews.length > 0) {

                tempbook.reviews = reviewCount
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })

            } else {
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })
            }
        } else {
            res.status(404).send({ status: false, msg: "book not exist" })

        }

    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.getBookWithreview = getBookWithreview