const express = require('express')
const app = express()
const connectDB = require('./config/db')

// make the db connection
connectDB()

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port: ${port}`))

// app.get('/', (req, res) => res.send('Hello World'))

// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
