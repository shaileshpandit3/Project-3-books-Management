

const express = require('express');
const router = express.Router();

const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewContoller =require('../controller/reviewController')
// const reviewContoller = require('../controller/reviewController')

// post for user

router.post('/register', userController.createUser)

router.post('/login', userController.loginUser)

router.post('/books', bookController.createBook)

router.get('/books', bookController.getBook)

router.delete('/books/:bookId', bookController.deletedById)
router.post('/books/:bookId/review', reviewContoller.addReview)
router.delete('/books/:bookId',bookController.deletedById)

module.exports = router;