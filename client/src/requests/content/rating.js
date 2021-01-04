import axios from "axios";
import API from '../common'

/**
 * Request to update the grade of a content
 * @param contentId content id
 * @param userId user id
 * @param category of content
 * @param value vote
 * @returns {Promise<>}
 */
const update = (contentId, userId, category, value) => {
    return axios.post(API + '/tmdb/rating/update', {
        params: {
            contentId: contentId,
            userId: userId,
            category: category,
            value: value
        }
    })
}

/**
 * Request to search for rated content
 * @param userId user id
 * @param isMovies true if the content is movie
 * @param isTvs true if the content is program tv
 * @param isActors true if the content is actor
 * @returns {Promise<>}
 */
const search = (userId, isMovies, isTvs, isActors) => {
    return axios.get(API + '/tmdb/rating/search', {
        params: {
            userId: userId,
            isMovies: isMovies,
            isTvs: isTvs,
            isActors: isActors
        }
    })
}

export const requestRating = {update, search};
