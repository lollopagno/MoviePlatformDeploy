import axios from "axios";
import API from '../common'

/**
 * Request to get popular actors
 * @param id user id
 * @returns {Promise<>}
 */
const popular = (id) => {
    return axios.get(API + '/tmdb/actors/popular', {params: {userId: id}})
}

/**
 * Request to search specific actor
 * @param id user id
 * @param data name actor
 * @returns {Promise<>}
 */
const search = (data, id) => {
    return axios.get(API + '/tmdb/actors/search', {params: {query: data, userId: id}})
}

export const requestActors = {popular, search};
