import axios from "axios";
import API from '../common'

/**
 * Request to get popular tv
 * @param id user id
 * @returns {Promise<>}
 */
const popular = (id) => {
    return axios.get(API + '/tmdb/tv/popular', {params: {userId: id}})
}

/**
 * Request to get top rated tv
 * @param id user id
 * @returns {Promise<>}
 */
const topRated = (id) => {
    return axios.get(API + '/tmdb/tv/top_rated', {params: {userId: id}})
}

/**
 * Request to search specific program tv
 * @param id user id
 * @param data name program tv
 * @returns {Promise<>}
 */
const search = (data, id) => {
    return axios.get(API + '/tmdb/tv/search', {params: {query: data, userId: id}})
}

export const requestTV = {popular, topRated, search};
