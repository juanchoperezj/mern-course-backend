const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    // grab the token from the header
    const token = req.header('x-auth-token')

    // validate if no token exists
    if (!token) {
        res.status(401).json({ errors: [{ msg: 'No token provided, request unauthorized' }] })
    }

    // validate token
    try {
        const decodedToken = jwt.verify(token, config.get('jwtSecret'))

        req.user = decodedToken.user
        next()
    } catch (e) {
        res.status(401).json({ errors: [{ msg: 'Token invalid, request unauthorized' }] })
    }
}
