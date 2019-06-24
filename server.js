const express = require('express')
const app = express()
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')

// make the db connection
connectDB()

// Init middleware
app.use(cors())
app.use(express.json({ extended: false }))

// app.get('/', (req, res) => res.send('Hello World'))

// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port: ${port}`))
