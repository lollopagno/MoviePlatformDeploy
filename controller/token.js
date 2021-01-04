const JWT_SECRET = require('../utils/env').JWTSecret
const jwt = require('jsonwebtoken');
const UserSchema = require('../model/user')
const EmailSchema = require('../model/tokenEmail')
const utils = require('../utils/commons')
const codeStatus = require('../utils/status')
const email = require('./email')
const crypto = require('crypto')

/**
 * Checked token email
 */
checkTokenEmail = (req, res) => {

    const token = req.body.token
    const username = req.body.username
    if (!username || !token) return utils.requestJsonFailed(res, codeStatus.badRequest, 'Must pass token and username')

    EmailSchema.findOne({token: token}, (err, token) => {
        if (!token) return utils.requestJsonFailed(res, codeStatus.badRequest, 'We were unable to find a valid token. Your token my have expired.')

        UserSchema.findOne({_id: token._userId, username: username}, (err, user) => {
            if (!user) return utils.requestJsonFailed(res, codeStatus.badRequest, 'We were unable to find a user for this token.')
            if (user.isVerified) return utils.requestJsonFailed(res, codeStatus.badRequest, 'This user has already been verified.')

            // Verify and update user data
            user.isVerified = true;
            user.save((err) => {
                if (err) return utils.requestJsonFailed(res, codeStatus.serverError, err.message)
                return utils.requestJsonSuccess(res, codeStatus.OK, 'The account has been verified. Please sign in.', utils.getCleanUser(user))
            })
        })
    })
}

/**
 * Resend token email
 */
resendTokenEmail = (req, res) => {
    const body = req.body
    if (!body.email) return utils.requestJsonFailed(res, codeStatus.badRequest, 'Must pass email address')

    UserSchema.findOne({'email': body.email.trim()}, (err, user) => {
        if (!user) return utils.requestJsonFailed(res, codeStatus.badRequest, 'We were unable to find a user with the specified email address.')

        // Delete old token (if present)
        EmailSchema.findOne({_userId: user._id}, (err, token) => {
            if (err) { /*pass*/ }
            else token.remove()
        })

        // Create new token email
        const tokenEmail = new EmailSchema({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        tokenEmail.save((err) => {
            if (err) return utils.requestJsonFailed(res, codeStatus.serverError, err.message)
        })

        // Send email
        email.sendEmail(user.email, user.name, tokenEmail.token).then(() => {
            console.log("[SERVER] Resend email.")
            return utils.requestJsonSuccess(res, codeStatus.OK, 'A verification email has been resent to ' + user.email + '.', utils.getCleanUser(user), tokenEmail.token)
        })
    })
}

/**
 * Check current token for the authentication session
 */
checkToken = (req, res) => {

    let token = req.headers['authorization']
    if (!token) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a token!')

    token = token.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET, (err, decode) => {
        if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, '')

        UserSchema.findById({'_id': decode._id}, (err, user) => {
            if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, '')

            const token = utils.generateToken(user);
            console.log("[New token created (CheckToken)] " + token)
            console.log("[SERVER] Check token user.")
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Check user completed!', utils.getCleanUser(user), token)
        });
    });
}

module.exports = {
    checkTokenEmail, resendTokenEmail, checkToken
}
