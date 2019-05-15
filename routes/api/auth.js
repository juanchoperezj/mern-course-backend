const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

// common
const validations = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
]

const jwtExpiration = process.env === 'production' ? 3600 : 3600000


// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select('-password')
        res.json(user)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

// @route   POST api/auth
// @desc    Authenticate User & get the token
// @access  Public
router.post('/', validations, async (req, res) => {
    try {
        const { email, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        // see if user exists
        let userInstance = await User.findOne({ email })

        if (!userInstance) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })

        const isMatch = await bcrypt.compare(password, userInstance.password)

        if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })

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
