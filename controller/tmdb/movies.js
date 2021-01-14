const KEY = require('../../utils/env').apiKeyTmdb

const utils = require('../../utils/commons')
const codeStatus = require('../../utils/status')
const contents = require('../../utils/contents')

const request = require('./common/request')

/**
 * Parameter to request a get api movies popular
 */
const PATH_POPULAR = '/3/movie/popular?api_key='

/**
 * Parameter to request a get api movies top rated
 */
const PATH_TOP_RATED = '/3/movie/top_rated?api_key='

/**
 * Parameter to request a get api movies upcoming
 */
const PATH_UPCOMING = '/3/movie/upcoming?api_key='

/**
 * Parameter to request a get api to search specific movie
 */
const PATH_SEARCH = '/3/search/movie?api_key='

/**
 * Movies popular to show
 */
popular = (req, res) => {
    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_POPULAR + KEY
    }

    request.waitData(contents.MOVIES, 'Popular', false, '', options, userId)
        .then(contents => {
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Movies popular found!', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'The search did not give any results!')
    })
}

/**
 * Movies top rated to show
 */
topRated = (req, res) => {
    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_TOP_RATED + KEY
    };

    request.waitData(contents.MOVIES,  'Top rated', false, '', options, userId)
        .then(contents => {
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Movies top rated found!', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'The search did not give any results!')
    })
}

/**
 * Movies upcoming to show
 */
upcoming = (req, res) => {
    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_UPCOMING + KEY
    };

    request.waitData(contents.MOVIES,'Upcoming', false, '', options, userId)
        .then(contents => {
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Movies upcoming found!', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'The search did not give any results!')
    })
}

/**
 * Search specific movie to show
 */
search = (req, res) => {

    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_SEARCH + KEY + "&query=" + (req.query.query).replace(/\s/g, '%20')
    };

    request.waitData(contents.MOVIES,null, true, req.query.query, options, userId)
        .then(contents => {
            return  utils.requestJsonSuccess(res, codeStatus.OK, 'Movies found', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'The search did not give any results!')
    })
}

module.exports = {
    popular, topRated, upcoming, search
}

