const express = require('express')
const mongoose = require('mongoose')

const app = express()

// routes declarations
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

// DB config
const db = require('./config/keys').mongoURI

// make mongodb connection
mongoose.connect(db)
    .then(() => console.log('mongo db connection successfully'))
    .catch(err => console.log('error connection with mongo, err: ', err))

const port = process.env.PORT || 5000

// routes implementations
app.use('/api/users', users)
app.use('/api/posts', posts)
app.use('/api/profile', profile)

app.listen(port, () => console.log(`server running on port: ${port}`))

app.get('/', (req, res) => res.send('Hello World'))

