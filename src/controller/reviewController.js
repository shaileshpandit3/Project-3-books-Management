
const bookModel = require('../models/bookModel')
const reviewModel = require("../models/reviewModel")
const validate = require('../validator/validators')


const addReview = async (req, res) => {

try {

    let reviewData = req.body
    let bookId = req.params.bookId

    let { reviewedBy, rating, review } = reviewData

    if (!bookId) {
        return res.status(400).send({ status: false, message: "Book Id Is Required" })
    }

    if (!validate.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Please Enter A valid Book Id" })
    }

    let isBookPresent = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if (!isBookPresent) {
        return res.status(404).send({ status: false, message: "Book not found, please check Book Id" })
    }

    if(!Object.keys(req.body).includes("reviewedBy")) {
        return res.status(404).send({ status: false, message: "reviewed By is require" })
    }

    if( reviewedBy == "" || reviewedBy == null ) {
        reviewedBy = 'Guest'
    }else{

        if(typeof reviewedBy !== String) {
            return res.status(400).send({ status : false, message: "Please Give a proper Name" })
        }
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

    let newData2 = {...newReview.toObject() }
    delete newData2.createdAt
    delete newData2.updatedAt
    delete newData2.__v

    let checkRevCount = await reviewModel.find({ bookId: bookId, isDeleted: false }).select(updatedAt = 0, createdAt = 0)
    let count = checkRevCount.length

    let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { reviews: count } }, { new: true })

    return res.status(201).send({
        status: true, message: "Success",
        Data: { ...updatedBook.toObject(),reviewsData: [newData2] }
    })

} catch (error) {
    res.status(500).send({ status: false, Message: error.message })
}
}

module.exports.addReview = addReview


// ================================================================================================

const updateReview = async (req, res) => {

try {
    
    const reviewID = req.params.reviewId
    const bookId = req.params.bookId
    let dataToUpdate = req.body
    let updateQuery ={}

    if(!validate.isValidRequestBody(dataToUpdate)) {
        return res.status(400).send({ status: false, message: "Please Provide Data To Update" })
    }

    if(!validate.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Invalid Book Id" })
    }
    
    let isBook = await bookModel.findOne({ _id : bookId, isDeleted: false }) 
    if(!isBook) {
        return res.status(404).send({ status: false, message: "Book Not Found, PLease check book Id" })
    }

    if(!validate.isValidObjectId( reviewID )) {
        return res.status(400).send({ status: false, message: "Invalid ReviewId" })
    }

    let isReview = await reviewModel.findOne({ _id: reviewID, isDeleted: false })
    if(!isReview) {
        return res.status(404).send({ status: false, message: "Review Not Found, Please Check Review Id" })
    }


    const { reviewedBy, rating, review } = dataToUpdate
    
    if( reviewedBy ) {
        
        if( (reviewedBy == "" )|| (reviewedBy == null) ) {
             reviewedBy = 'Guest'
        }else{
    
            if(typeof reviewedBy !== String ) {
                return res.status(400).send({ status : false, message: "Please Give a proper Name" })
            }
        }

        updateQuery.reviewedBy = reviewedBy
    }

    
    if( rating ) {

        if(typeof rating !== Number) {
            return res.status(400).send({ status: false, message: "invalid Rating Input" })
        }
        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Invalid Rating! , please rate in beetween 1 to 5" })
        }

        updateQuery.rating = rating
    }

    if(review) {

        if (!validate.isValid(review)) {
            return res.status(400).send({ status: false, message: "Please Enter A Valid Review" })
        }
         updateQuery.review = review
    }

    if(isReview['bookId'] == bookId){

        const updatedReview = await reviewModel.findOneAndUpdate({ _id:reviewID, isDeleted: false },
            {$set: updateQuery },
            {new: true}).select( { __v : 0 } )

        return res.status(200).send({ status: true, message:"Success", Data: updatedReview })


    }else {
        return res.status(400).send({ status: false, message: "This review dosent belong To given Book Id" })
    }

} catch (error) {
    res.status(500).send({ status: false, message: error.message })
}
}   
module.exports.updateReview = updateReview


// { reviewedBy: reviewedBy, rating: rating, review: review }