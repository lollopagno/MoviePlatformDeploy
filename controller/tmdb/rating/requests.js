const https = require('https');
const contents = require('../../../utils/contents')
const RatingSchema = require('../../../model/rating')
const object = require('../common/object')

/**
 * Get details information for each content tmdb
 */
function getDetails(options, userId, category, callback) {

    const req = https.get(options, (result) => {

        let allData = '';

        if (result.statusCode === 200) {
            result.setEncoding('utf8');
            result.on('data', (data) => {
                allData += data
            }).on("error", err => {
                callback([])
            }).on('close', () => {

                const content = JSON.parse(allData)
                search(userId, content.id, category).then(value => {
                    if (category === contents.MOVIES) callback(object.dataMovies(content, value, category))
                    else if (category === contents.PROGRAM_TV) callback(object.dataTvs(content, value, category))
                    else callback(object.dataActors(content, value, category))
                })
            })
        } else callback([])

    })
    req.on("error", () => {
        callback([])
    })

    req.end()
}

/**
 * Search specific rated content
 */
async function search(userId, contentId, category) {
    const result = await RatingSchema.findOne({'_userId': userId}).select({
        content: {
            $elemMatch: {
                '_contentId': contentId,
                'category': category
            }
        }
    })

    if (result.content.length === 0) return 0
    else return result.content[0].value
}

module.exports = {getDetails, search}
