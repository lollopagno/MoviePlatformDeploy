const express = require('express');
const User = require('../controller/user');
const Token = require('../controller/token');
const Email = require('../controller/email');

const Movies = require('../controller/tmdb/movies');
const TVPrograms = require('../controller/tmdb/tv');
const Actors = require('../controller/tmdb/actors');

const Rating = require('../controller/tmdb/rating/rating')
const NewContents = require('../controller/tmdb/newContents/newContents')

const router = express.Router();

/**
 * To store a user uploaded image
 */
const multer = require("multer");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({storage: storage}).single('img');

/**
 * User Route
 */
router.get('/user/same_field', (req, res) => User.sameField(req, res));
router.get('/user/not_same_field', (req, res) => User.sameFieldExceptUser(req, res));
router.post('/user/sign_in', (req, res) => User.signIn(req, res));
router.post('/user/new_user', (req, res) => User.signUp(req, res));
router.put('/user/change_data', (req, res) => User.changeData(req, res));
router.delete('/user/delete_account', (req, res) => User.deleteUser(req, res));


/**
 * Email route
 */
router.get('/email/validation', (req, res) => Email.validationEmail(req, res));

/**
 * Token route
 */
router.post('/token/email/confirmation', (req, res) => Token.checkTokenEmail(req, res));
router.post('/token/email/resend', (req, res) => Token.resendTokenEmail(req, res));
router.post('/token/authentication/check', (req, res) => Token.checkToken(req, res));

/**
 * Movies route
 */
router.get('/tmdb/movies/popular', (req, res) => Movies.popular(req, res));
router.get('/tmdb/movies/top_rated', (req, res) => Movies.topRated(req, res));
router.get('/tmdb/movies/upcoming', (req, res) => Movies.upcoming(req, res));
router.get('/tmdb/movies/search', (req, res) => Movies.search(req, res));

/**
 * Programs tv route
 */
router.get('/tmdb/tv/popular', (req, res) => TVPrograms.popular(req, res));
router.get('/tmdb/tv/top_rated', (req, res) => TVPrograms.topRated(req, res));
router.get('/tmdb/tv/search', (req, res) => TVPrograms.search(req, res));

/**
 * Actors route
 */
router.get('/tmdb/actors/popular', (req, res) => Actors.popular(req, res));
router.get('/tmdb/actors/search', (req, res) => Actors.search(req, res));

/**
 * Rated contents route
 */
router.post('/tmdb/rating/update', (req, res) => Rating.update(req, res));
router.get('/tmdb/rating/search', (req, res) => Rating.searchAll(req, res));

/**
 * New contents route
 */
router.post('/tmdb/new_content/add', (req, res) => NewContents.added(req, res))
router.put('/tmdb/new_content/update', upload, (req, res) => NewContents.updated(req, res))

/**
 * Route to export
 */
module.exports = router;

