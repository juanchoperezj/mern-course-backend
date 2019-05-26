const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/Users')

// common
const validations = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please the password need to be at least 5 chars').isLength({ min: 5 }),
    check('name', 'Name is required').not().isEmpty()
]

const jwtExpiration = process.env === 'production' ? 3600 : 3600000

const gravatarOptions = {
    s: '200',
    r: 'pg',
    d: 'mm'
}

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('User get route'))

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/register', validations, async (req, res) => {
    try {
        // console.log('expiresIn: ', jwtExpiration)
        const { email, name, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log('here')
            return res.status(400).send({ errors: errors.array() })
        }
        // see if user exists
        let userInstance = await User.findOne({ email })
        if (userInstance) {
            return res.status(400).json({ errors: [{ msg: 'User is already registered' }] })
        }

        // get the user Gravatar
        const avatar = gravatar.url(email, gravatarOptions)

        // generate a salt and hash the password
        const salt = await bcrypt.genSalt(10)
        const passHashed = await bcrypt.hash(password, salt)

        userInstance = new User({
            name,
            email,
            avatar,
            password: passHashed
        })

        await userInstance.save()
        const payload = {
            user: {
                id: userInstance.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: jwtExpiration },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            }
        )

    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
    }
})


module.exports = router
