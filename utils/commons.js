const JWT_SECRET = require('../utils/env').JWTSecret
const jwt = require('jsonwebtoken');

module.exports = {

    /**
     * Host api tmdb
     */
    HOST: 'api.themoviedb.org',

    /**
     * Url to get image for contents tmdb
     */
    IMAGE: 'https://image.tmdb.org/t/p/w500/',

    /**
     * Return a failed request
     * @param res object res
     * @param statusCode status code
     * @param message message to send
     * @returns {*}
     */
    requestJsonFailed: (res, statusCode, message) => {
        return res.status(statusCode).json({
            success: false,
            message: message,
        })
    },

    /**
     * Return a successful request
     * @param res
     * @param statusCode
     * @param message
     * @param data
     * @param token
     * @returns {*}
     */
    requestJsonSuccess: (res, statusCode, message, data, token) => {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data,
            token: token
        })
    },

    /**
     * Generate token to authentication
     * @param user data for token
     * @returns json token
     */
    generateToken: (user) => {
        const tokenData = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
        };
        return jwt.sign(tokenData, JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "60m", /* minutes */
        });
    },

    /**
     * Return user data to send a client
     * @param user user data
     * @returns json user data
     */
    getCleanUser: (user) => {
        if (!user) return {};

        const userClean = user.toJSON();

        return {
            _id: userClean._id,
            name: userClean.name,
            email: userClean.email,
            username: userClean.username,
        }
    }
}
