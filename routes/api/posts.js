const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

// auth middleware
const auth = require('../../middleware/auth')

// models
const Post = require('../../models/Posts')
const User = require('../../models/Users')
const Profile = require('../../models/Profile')

// validations
const postValidation = [
    check('post.text', 'Text is required').not().isEmpty()
]
const commentValidation = [
    check('comment.text', 'Text is required').not().isEmpty()
]

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', [auth, postValidation], async (req, res) => {
    const errors = validationResult(req)
    const { post } = req.body
    const { id: userId } = req.user

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(userId).select('-password')
        const newPost = new Post({
            ...post,
            name: user.name,
            avatar: user.avatar,
            user: userId
        })

        const postCreated = await newPost.save()
        res.json(postCreated)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   GET api/posts
// @desc    Get all post
// @access  Private
router.get('/', [auth], async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', [auth], async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post)
    } catch (e) {
        console.log(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   Delete api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', [auth], async (req, res) => {
    try {
        const { id } = req.params
        const { id: userId } = req.user
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        if (post.user.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized' })
        }
        await post.remove()
        res.json({ msg: 'Post removed' })

    } catch (e) {
        console.log(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   PUT api/posts/like/:id
// @desc    Un/Like a post
// @access  Private
router.put('/like/:id', [auth], async (req, res) => {
    try {
        const { id: userId } = req.user
        const { id } = req.params

        const post = await Post.findById(id)

        // check if the post has already been liked
        const beenLiked = post.likes.filter(like => like.user.toString() === userId).length > 0
        if (beenLiked) {
            // unlike
            post.likes = post.likes.filter(like => like.user.toString() !== userId)

            await post.save()
            return res.json(post.likes)


        }

        const notLiked = post.likes.filter(like => like.user.toString() === userId).length === 0
        if (notLiked) {
            // like
            post.likes.unshift({ user: userId })
            await post.save()
            return res.json(post.likes)
        }


    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [auth, commentValidation], async (req, res) => {
    const errors = validationResult(req)
    const { comment } = req.body
    const { id: userId } = req.user
    const { id } = req.params

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(userId).select('-password')
        const post = await Post.findById(id)

        const newComment = {
            ...comment,
            name: user.name,
            avatar: user.avatar,
            user: userId
        }

        post.comments.unshift(newComment)
        await post.save()

        res.json(post.comments)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(`Server error: ${e.message}`)
    }
})

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete('/comment/:id/:comment_id', [auth], async (req, res) => {
    try {
        const { id, comment_id } = req.params
        const { id: userId } = req.user

        const post = await Post.findById(id)

        const comment = post.comments.find(comment => comment.id === comment_id)

        if (!comment) {
            return res.status(404).json({ msg: 'Comment doesnt exist' })
        }

        if (comment.user.toString() !== userId) {
            return res.status(401).json({ msg: 'User unauthorized' })
        }

        post.comments = post.comments.filter(comment => comment.id !== comment_id)

        await post.save()
        res.json(post.comments)
    } catch (e) {
        console.log(e.message)
        if(e.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Comment doesnt exist' })
        }
        res.status(500).send(`Server error: ${e.message}`)
    }
})

module.exports = router
