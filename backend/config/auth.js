const jwt = require('jsonwebtoken')
const env = require('../.env')

module.exports = (req, res, next) => {
    // CORS preflight request
    if (req.method === 'OPTIONS') {
        return next()
    }

    // Получение токена из различных мест
    const token = req.body.token || req.query.token || req.headers['authorization']

    if (!token) {
        return res.status(403).send({ errors: ['No token provided.'] })
    }

  
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token

    jwt.verify(tokenWithoutBearer, env.authSecret, function (err, decoded) {
        if (err) {
            return res.status(403).send({
                errors: ['Failed to authenticate token.']
            })
        } else {
            req.decoded = decoded
            next()
        }
    })
}
