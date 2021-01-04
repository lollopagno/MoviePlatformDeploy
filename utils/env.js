require('dotenv').config()

/**
 * Environment variables
 * @type {{mongoUri: *, apiKeyTmdb: *, emailKeyPublic: *, emailKeyPrivate: *, serverPort: *, JWTSecret: *}}
 */
module.exports = {
    mongoUri: process.env.MONGODB_URI,
    serverPort: process.env.PORT,
    JWTSecret: process.env.JWT_SECRET,
    emailKeyPublic: process.env.EMAIL_APIKEY_PUBLIC,
    emailKeyPrivate: process.env.EMAIL_APIKEY_PRIVATE,
    apiKeyTmdb: process.env.APY_KEY_TMDB
}
