const jwt = require('jsonwebtoken')

const mid = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            res.status(401).send({ status: false, msg: 'Token not present in the header' })
            return
        }
        let decodeToken = jwt.verify(token, 'group2')
        if (decodeToken) {
            req.decodeToken = decodeToken
            next()
        }
        res.status(401).send({ status: false, msg: "Not a valid Token " })

    } catch (error) {
        res.status(500).send({ statsu: false, msg: error })
    }
}

module.exports.mid= mid