const utils = require('../../../utils/commons')

/**
 * Module to extract information from contents, by category
 */
module.exports = {

    /**
     * Manage movies contents
     */
    dataMovies: function (content, value, category) {
        return {
            _id: content.id,
            title: content.original_title,
            date: content.release_date,
            img: content.poster_path !== null ? utils.IMAGE + content.poster_path : null,
            language: content.original_language,
            vote: content.vote_average,
            rating: value,
            category: category
        }
    },

    /**
     * Manage programs tv contents
     */
    dataTvs: function (content, value, category) {
        return {
            _id: content.id,
            title: content.original_name,
            date: content.first_air_date,
            img: content.poster_path !== null ? utils.IMAGE + content.poster_path : null,
            language: content.original_language,
            vote: content.vote_average,
            rating: value,
            category: category
        }
    },

    /**
     * Manage actors contents
     */
    dataActors: function (content, value, category) {
        return {
            _id: content.id,
            name: content.name,
            img: content.profile_path !== null ? utils.IMAGE + content.profile_path : null,
            popularity: content.popularity,
            department: content.known_for_department,
            rating: value,
            category: category
        }
    }
}
