const https = require('https');

const rating = require('../rating/requests')
const newContents = require('../newContents/newContents')
const categoryContents = require('../../../utils/contents')
const object = require('./object')

module.exports = {

    /**
     * Search for content on db and API tmdb
     * @param CATEGORY content category
     * @param SECTION content section
     * @param isSearch true if you need to find
     * @param searchQuery query to execute
     * @param options info about the host and url
     * @param userId user id
     * @returns {Promise}
     */
    waitData: async (CATEGORY, SECTION, isSearch, searchQuery, options, userId) => {

        const contentsUser = await newContents.searchContentToShow(CATEGORY, SECTION, isSearch, searchQuery, userId)
        const contentsTmdb = await getInfo(CATEGORY, options, userId)

        return Promise.all([contentsTmdb, contentsUser])
    },
}

/**
 * Search for content on APIs tmdb
 * @param category content category
 * @param options_requests info about the host and url
 * @param userId user id
 * @returns {Promise}
 */
async function getInfo(category, options_requests, userId) {

    return new Promise((resolve, reject) => {
        const req = https.get(options_requests, result => {
            let allData = '';

            if (result.statusCode === 200) {
                result.setEncoding('utf8');
                result.on('data', (data) => {
                    allData += data
                }).on("error", (err) => {
                    reject(err.message)
                }).on('close', () => {
                    let contents = [];
                    let countData = 0

                    const data = JSON.parse(allData).results
                    if (data.length === 0) resolve(contents)
                    data.forEach((content) => {

                        rating.search(userId, content.id, category).then(value => {

                            if (category === categoryContents.MOVIES) contents.push(object.dataMovies(content, value, categoryContents.MOVIES))
                            else if (category === categoryContents.PROGRAM_TV) contents.push(object.dataTvs(content, value, categoryContents.PROGRAM_TV))
                            else if (category === categoryContents.ACTORS) contents.push(object.dataActors(content, value, categoryContents.ACTORS))

                            countData++
                            if (data.length === countData) resolve(contents)
                        })
                    })
                });
            } else {
                reject("Status code " + result.statusCode)
            }
        })
        req.on("error", (err) => {
            reject(err.message)
        })
        req.end()
    })
}
