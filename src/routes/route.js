

const express = require('express');
const router = express.Router();

const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewContoller =require('../controller/reviewController')
const mid1 = require('../middleware/auth')


// post for user

router.post('/register', userController.createUser)

// post for login user 

router.post('/login', userController.loginUser)

// post for book

router.post('/books', mid1.mid, bookController.createBook)


// get for book

router.get('/books', mid1.mid, bookController.getBook)

// update for book

router.put('/books/:bookId', mid1.mid,  bookController.updateBook)

// post add review

router.post('/books/:bookId/review', reviewContoller.addReview)

// delete book by book id

router.delete('/books/:bookId',bookController.deletedById)

module.exports = router;