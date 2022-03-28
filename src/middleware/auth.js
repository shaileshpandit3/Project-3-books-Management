const jwt = require('jsonwebtoken')

const mid = function (req, res, next) {
    try {
        let token = req.header['x-api-key']
        if (!token) {
            res.status(401).send({ status: false, msg: 'Token not present in the header' })
            return
        } else {
            let decodeToken = jwt.verify(token, 'Group-2')
            if (decodeToken) {
                req.decodeToken = decodeToken
                next()
            } else {
                res.status(401).send({ status: false, msg: "NOt a valid Token " })
            }
        }

    } catch (error) {
        res.status(500).send({ statsu: false, msg: error })
    }
}