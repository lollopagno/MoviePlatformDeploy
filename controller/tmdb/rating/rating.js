const RatingSchema = require('../../../model/rating')
const newContents = require('../../tmdb/newContents/newContents')
const requests = require('../rating/requests')

const KEY = require('../../../utils/env').apiKeyTmdb

const utils = require('../../../utils/commons')
const codeStatus = require('../../../utils/status')
const contents = require('../../../utils/contents')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

/**
 * Module to update and search for the vote on the contents
 */
module.exports = {

    /**
     * Updated the rating of a content
     */
    update: async (req, res) => {

        if (!req.body.params) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a parameters!')

        const {userId, contentId, category, value} = req.body.params
        if (!userId || !contentId || !category || !value) return utils.requestJsonFailed(res, codeStatus.notFound, 'Must pass parameters!')

        const updated = await RatingSchema.findOneAndUpdate(
            {'_userId': userId, 'content._contentId': contentId},
            {$set: {'content.$.value': value}})

        if (updated === null) {

            await RatingSchema.updateOne(
                {'_userId': userId},
                {
                    $push: {
                        content: {
                            category: category,
                            _contentId: contentId,
                            value: value
                        }
                    }
                })
            return utils.requestJsonSuccess(res, codeStatus.OK)

        } else return utils.requestJsonSuccess(res, codeStatus.OK)
    },

    /**
     * Search for rated content
     */
    searchAll: async (req, res) => {

        const query = req.query
        if (!query.userId || !query.isMovies || !query.isActors || !query.isTvs) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a parameters!')

        const {userId, isMovies, isTvs, isActors} = req.query
        if (!userId || !isMovies || !isTvs || !isActors) return utils.requestJsonFailed(res, codeStatus.notFound, 'Must pass parameters')

        const eqMovies = {$eq: ['$$item.category', isMovies === 'true' ? contents.MOVIES : '']}
        const eqTvs = {$eq: ['$$item.category', isTvs === 'true' ? contents.PROGRAM_TV : '']}
        const eqActors = {$eq: ['$$item.category', isActors === 'true' ? contents.ACTORS : '']}

        let result = await RatingSchema.aggregate([

            {$match: {_userId: ObjectId(userId)}},
            {
                $project: {
                    content: {
                        $filter: {
                            input: '$content',
                            as: 'item',
                            cond: {
                                $or: [
                                    eqMovies,
                                    eqTvs,
                                    eqActors
                                ]
                            }
                        }
                    }
                }
            }
        ])

        this.result = result[0].content
        if (this.result.length === 0) return utils.requestJsonFailed(res, codeStatus.notFound, 'No contents found!')

        let allDataRating = []
        let countData = 0

        // Extract info for each content
        const promise = new Promise((resolve) => {
            this.result.forEach(content => {
                newContents.searchContentRate(content._contentId, content.value).then(contentUser => {
                        if (contentUser.length !== 0) {
                            allDataRating.push(contentUser[0])
                            countData++
                            if (countData === this.result.length) resolve()
                        } else
                            getContentsRateTmdb(userId, content).then(contentTmdb => {
                                allDataRating.push(contentTmdb)
                                countData++
                                if (countData === this.result.length) resolve()
                            })
                    }
                )
            })

        })
        promise.then(() => {
            return utils.requestJsonSuccess(res, codeStatus.OK, 'Contents found!', allDataRating)
        })
    }
}

/**
 * Get api to extract content tmdb information
 */
function getContentsRateTmdb(userId, content) {

    let CATEGORY = ''
    let options = {}

    switch (content.category) {
        // Movies
        case contents.MOVIES:
            CATEGORY = contents.MOVIES
            options = {
                host: utils.HOST,
                path: '/3/movie/' + content._contentId + '?api_key=' + KEY
            };
            break;
        // Programs tv
        case contents.PROGRAM_TV:
            CATEGORY = contents.PROGRAM_TV
            options = {
                host: utils.HOST,
                path: '/3/tv/' + content._contentId + '?api_key=' + KEY
            };
            break;
        // Actors
        case contents.ACTORS:
            CATEGORY = contents.ACTORS
            options = {
                host: utils.HOST,
                path: '/3/person/' + content._contentId + '?api_key=' + KEY
            };
            break;
    }

    return new Promise(resolve => {
        // Get details
        requests.getDetails(options, userId, CATEGORY, obj => {
            if (Object.keys(obj).length !== 0) {
                resolve(obj)
            }
        })
    })
}

