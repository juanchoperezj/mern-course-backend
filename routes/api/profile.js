const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const { check, validationResult } = require('express-validator/check')


// common
const postProfileValidations = [
    check('profile.status', 'Status is required').not().isEmpty(),
    check('profile.skills', 'Skills is required').not().isEmpty()
]

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const { id } = req.user
        const profile = await Profile.findOne({ user: id })
        if (!profile) {
            return res.status(400).json({ errors: [{ msg: 'There is no profile for this user' }] })
        }
    } catch (e) {
        console.error(e)
        res.status(500).send('Server error')
    }
})

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.post('/', [auth, postProfileValidations], async (req, res) => {

    const { id: userId } = req.user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const profileBody = Object.assign({}, req.body.profile)
    const profileFields = {}

    Object.keys(profileBody).map((key, index) => {
        if (profileBody[key] && key === 'skills') {
            profileFields[key] = profileBody[key].split(',').map((skill, k) => skill.trim())
        } else profileFields[key] = profileBody[key]
    })

    try {
        let profile = await Profile.findOne({ user: userId })
        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate(
                { user: userId },
                { $set: profileFields },
                { new: true }
            )
            res.json(profile)
        }

        // create
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch (e) {
        console.error(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }


})

module.exports = router
