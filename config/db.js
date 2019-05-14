const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = async () => {
    try {
        const dbOptions = {
            useNewUrlParser: true,
            useCreateIndex: true
        }

        await mongoose.connect(db, dbOptions)
        console.log('connection successful')
    } catch (e) {
        console.log(`error connecting to mongo: ${e.message}`)
        // exit node process with failure
        process.exit(1)
    }
}

module.exports = connectDB
