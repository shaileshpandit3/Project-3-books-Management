

const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const validate = require('../validator/validators')

const createBook = async (req, res) => {

try {
    let bookData = req.body

    if(!validate.isValidRequestBody(bookData)) {
        return res.status(400).send({ status : false , message : "Invalid Parameters" })
    }

    const {title, excerpt, userId, ISBN, category, subcategory, reviews} = req.body

    if(!validate.isValid(title)) {
        return res.status(400).send({ status : false, message: "title Is Required" })
    }

    if(!validate.isValid(excerpt)) {
        return res.status(400).send({ status: false , message : "Excerpt Is Requird" })
    }

    if(!validate.isValidObjectId(userId)) {
        return res.status(400).send({ status : false, message : "Invalid User Id!" })
    }

    const ifUserExist = await userModel.findById(userId)

    if(!ifUserExist) {
        return res.status(404).send({ status : false, message : "User Not Found, Please Check User Id" })
    }
    
    if(!validate.isValidISBN(ISBN)) {
        return res.status(400).send({ status : fasle, message : "Invalid ISBN Enterd" })
    }

    if(!validate.isValid(category)) {
        return res.status(400).send({ status : fasle, message : "Category Is Required" })
    }

    if(!validate.isValid(subcategory)) {
        return res.status(400).send({ status : false, message : "Subcategory Is Required" })
    }

   if(reviews) {
       if(typeof reviews !== 'number') {
           return res.status(400).send({ status : false, message : "Unexpected Input" })
       }
   }

   if( req.body.isDeleted === true ) {
       return res.status(400).send({ status : false, message : "No Data Should Be Deleted At The Time Of Creation" })
   }

    const newBook = await bookModel.create( bookData )
    return res.status(201).send({ status : true, message : "Success", Data : newBook })
    
} catch (error) {
    res.status(500).send({ status : false, Message : error.message })
}
    
};

module.exports.createBook = createBook