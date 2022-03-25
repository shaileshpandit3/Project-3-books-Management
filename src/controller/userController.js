
const userModel = require('../models/userModel')


// USER CREATATION 
const createUser = async function (req, res) {
    let requestBody = req.body;
    try {

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
            return
        }

        const { name, title, email, phone, password } = requestBody

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title is required' })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: `Title should be among Mr, Mrs, Miss ` })
            return
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: 'phone number is required' })
            return
        }

        if (!(/^[6-9]\d{9}$/gi.test(phone))) {
            res.status(400).send({ status: false, message: `phone number should be valid number` })
        }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone });

        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone}  is already registered` })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        if (!(/[a-zA-Z0-9@]{8,15}/.test(password))) {
            res.status(400).send({ status: false, message: `password length should be betwwen 8-15` })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }

        let user = await userModel.create(req.body)
        res.status(201).send({ status: true, data: user })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}