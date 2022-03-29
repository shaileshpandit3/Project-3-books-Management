

const express = require('express');
const router = express.Router();

const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewContoller =require('../controller/reviewController')
const middleware = require('../middleware/auth')
// const reviewContoller = require('../controller/reviewController')

// post for user

router.post('/register', userController.createUser)

// post for login user 

router.post('/login', userController.loginUser)

router.post('/books', middleware.mid, bookController.createBook)

router.get('/books', middleware.mid, bookController.getBook)

router.get('/books/:bookId',bookController.getBookWithreview)

router.put('/books/:bookId', middleware.mid, bookController.updateBook)

router.post('/books/:bookId/review', middleware.mid,reviewContoller.addReview)

router.delete('/books/:bookId',middleware.mid,bookController.deletedById)

router.put('/books/:bookId/review/:reviewId',reviewContoller.updateReview)

module.exports = router;