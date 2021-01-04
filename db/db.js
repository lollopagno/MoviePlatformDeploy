const URI_MONGODB = require('../utils/env').mongoUri
const mongoose = require('mongoose')

/**
 * Connection mongo db
 */
mongoose
    .connect(URI_MONGODB || 'mongodb://127.0.0.1:27017/MyDb', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(console.info("Connection Db Accepted"))
    .catch(e => {
        console.error('Connection error', e.message)
    })

module.exports = mongoose.connection
