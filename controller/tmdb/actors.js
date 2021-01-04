const KEY = require('../../utils/env').apiKeyTmdb

const utils = require('../../utils/commons')
const contents = require('../../utils/contents')
const codeStatus = require('../../utils/status')

const request = require('./common/request')

/**
 * Parameter to request a get api actors popular
 */
const PATH_POPULAR = '/3/person/popular?api_key='

/**
 * Parameter to request a get api to search specific actor
 */
const PATH_SEARCH = '/3/search/person?api_key='

/**
 * Actors popular to show
 */
popular = (req, res) => {
    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_POPULAR + KEY
    };

    request.waitData(contents.ACTORS, null, false, '', options, userId)
        .then(contents => {
            return  utils.requestJsonSuccess(res, codeStatus.OK, 'Actors found!', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'No internet connection!')
    })
}

/**
 * Search specific actor to show
 */
search = (req, res) => {
    if(!req.query.userId) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a id!')
    const userId = req.query.userId

    const options = {
        host: utils.HOST,
        path: PATH_SEARCH + KEY + "&query=" + (req.query.query).replace(/\s/g, '%20')
    };

    request.waitData(contents.ACTORS, null,true, req.query.query, options, userId)
        .then(contents => {
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Actors found!', contents[0].concat(contents[1]))
        }).catch(() => {
        return utils.requestJsonFailed(res, codeStatus.badRequest, 'No internet connection!')
    })
}

module.exports = {
    popular, search
}

