const fs = require('fs');

const rating = require('../rating/requests')
const NewContentsSchema = require('../../../model/newContents')

const utils = require('../../../utils/commons')
const codeStatus = require('../../../utils/status')
const contents = require('../../../utils/contents')

/**
 * Module to perform operations on the db and search for new content
 */
module.exports = {

    /**
     * Added new content
     */
    added: (req, res) => {

        let {_userId, category} = req.body
        if (!_userId || !category) return utils.requestJsonFailed(res, codeStatus.badRequest, 'You must pass a parameters!')

        if (category !== contents.ACTORS) {
            /* Movies and tv */
            const {title, date, language, vote, section} = req.body

            // CREATE new contents document
            const newContents = new NewContentsSchema({
                category: category,
                section: section,
                title: title,
                date: new Date(date),
                language: language,
                vote: vote,
                _userId: _userId
            })

            newContents.save(function (err, content) {
                if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
                return utils.requestJsonSuccess(res, codeStatus.OK, 'The content ' + content.title + ' has been added.', content)
            })

        } else {
            /* Actors */

            const {title, vote, department} = req.body

            // CREATE new contents document
            const newContents = new NewContentsSchema({
                category: category,
                _userId: _userId,
                title: title,
                department: department,
                vote: vote
            })

            newContents.save(function (err, content) {
                if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, err.message)
                return utils.requestJsonSuccess(res, codeStatus.OK, 'The content ' + content.title + ' has been added.', content)
            })
        }
    },

    /**
     * Updated new content (added image)
     */
    updated: (req, res) => {

        if (!req.file) return utils.requestJsonSuccess(res, codeStatus.serverError, 'You must pass a file!')
        const _id = req.headers['_id']
        const fileImg = req.file

        NewContentsSchema.findOneAndUpdate({_id: _id}, {
            $set: {'img.data': fs.readFileSync(fileImg.path), 'img.contentType': fileImg.mimetype}
        }, {new: true}, (err, content) => {
            if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, err.message)

            // Delete image on directory server
            fs.unlink(fileImg.path, err => {
                if (err) {
                }
            })
            return utils.requestJsonSuccess(res, codeStatus.OK, 'The content ' + content.title + ' has been added.', content)
        })
    },

    /**
     * Search new contents to show
     */
    searchContentToShow: async (CATEGORY, SECTION, isSearch, query, userId) => {
        return new Promise(resolve => {

            let searchQuery = ''
            if (isSearch) searchQuery = {$and: [{'category': CATEGORY}, {'title': {$regex: new RegExp(query, "i")}}]}
            else searchQuery = {$and: [{'category': CATEGORY}, {'section': SECTION}]}

            NewContentsSchema.find(searchQuery, (err, contentsUser) => {

                let countData = 0
                let allData = []

                if (contentsUser.length === 0) resolve(contentsUser)
                contentsUser.forEach(content => {
                    rating.search(userId, content._id, content.category).then(value => {
                        allData.push(pushData(content, value))

                        countData++
                        if (countData === contentsUser.length) {
                            resolve(allData)
                        }
                    })
                })
            })
        })
    },

    /**
     * Search for new rated content
     */
    searchContentRate: async (contentId, value) => {
        return new Promise(resolve => {
            NewContentsSchema.find({_id: contentId}, (err, contentsUser) => {
                let allData = []
                let countData = 0

                if (contentsUser === undefined || contentsUser.length === 0) resolve(allData)
                else {
                    contentsUser.forEach(content => {
                        allData.push(pushData(content, value))
                        countData++
                        if (countData === contentsUser.length) resolve(allData)
                    })
                }
            })
        })
    }
}

/**
 * Extract information from contents
 */
function pushData(content, value) {
    return {
        _id: content._id,
        category: content.category,
        title: content.title,
        date: content.date !== undefined ? content.date.getFullYear() + '-' + content.date.getMonth() + "-" + content.date.getDate() : undefined,
        language: content.language,
        vote: content.category !== contents.ACTORS ? content.vote : undefined,
        popularity: content.category === contents.ACTORS ? content.vote : undefined,
        department: content.department !== undefined ? content.department : undefined,
        rating: value,
        img: content.img.data !== undefined ? `data:` + content.img.contentType + `;base64,` + new Buffer.from(content.img.data).toString('base64') : null

    }
}
