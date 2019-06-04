const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('config')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const Post = require('../../models/Posts')
const { check, validationResult } = require('express-validator/check')


// express validation rules
const postProfileValidations = [
    check('profile.status', 'Status is required').not().isEmpty(),
    check('profile.skills', 'Skills is required').not().isEmpty()
]

const experienceValidators = [
    check('experience.title', 'Title is required').not().isEmpty(),
    check('experience.company', 'Company is required').not().isEmpty(),
    check('experience.from', 'From date is required').not().isEmpty(),
]

const educationValidators = [
    check('education.school', 'School is required').not().isEmpty(),
    check('education.degree', 'Degree is required').not().isEmpty(),
    check('education.fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('education.from', 'From date is required').not().isEmpty(),
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
        return res.json(profile)
    } catch (e) {
        console.error(e)
        res.status(500).send('Server error')
    }
})

// @route   POST api/profile
// @desc    Create / update profile
// @access  Private
router.post('/', [auth, postProfileValidations], async (req, res) => {

    const { id: userId } = req.user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const profileBody = Object.assign({}, req.body.profile)
    let profileFields = {
        user: userId
    }

    console.log('profileBody', profileBody)

    if (!profileBody.edit) {
        Object.keys(profileBody).map((key, index) => {
            if (profileBody[key] && key === 'skills') {
                profileFields[key] = profileBody[key].split(',').map((skill, k) => skill.trim())
            } else profileFields[key] = profileBody[key]
        })
    } else {
        profileFields = profileBody
    }

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

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params // url params
        const profileByUser = await Profile.findOne({ user: user_id }).populate('user', ['name', 'avatar'])

        if (!profileByUser) {
            return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
        }

        res.json(profileByUser)
    } catch (e) {
        console.log(e.message)
        // res.status(500).json(e)
        if (e.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
        }
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   DELETE api/profile/
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        const { id } = req.user

        await Post.deleteMany({ user: id })
        // remove profile
        await Profile.findOneAndRemove({ user: id })
        // remove user
        await User.findOneAndRemove({ _id: id })
        res.json({ msg: 'User removed' })
        // todo remove users post's
    } catch (e) {
        console.error(e)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [auth, experienceValidators], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { id } = req.user
        const newExp = req.body.experience
        const profile = await Profile.findOne({ user: id })

        profile.experience.unshift(newExp)
        await profile.save()

        res.json(profile)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   DELETE api/profile/experience/exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const { exp_id } = req.params
        const { id } = req.user
        const profile = await Profile.findOne({ user: id })
        profile.experience = profile.experience.filter(exp => exp.id !== exp_id)
        await profile.save()
        res.json(profile)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [auth, educationValidators], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { id } = req.user
        const newEducation = req.body.education
        const profile = await Profile.findOne({ user: id })

        profile.education.unshift(newEducation)
        await profile.save()

        res.json(profile)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   DELETE api/profile/education/edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const { edu_id } = req.params
        const { id } = req.user
        const profile = await Profile.findOne({ user: id })
        profile.education = profile.education.filter(exp => exp.id !== edu_id)
        await profile.save()
        res.json(profile)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server error')
    }
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
    const { username } = req.params
    const clientId = config.get('githubClientId')
    const clientSecret = config.get('githubClientSecret')
    const options = {
        uri: `https://api.github.com/users/${username}/repos?per_page=5
        &sort=create:asc&client_id=${clientId}&client_secret=${clientSecret}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
        if (error) console.log(error)

        if (response.statusCode !== 200) {
            return res.status(404).json({ msg: 'No github profile found' })
        }

        res.json(JSON.parse(body))
    })
})

module.exports = router
