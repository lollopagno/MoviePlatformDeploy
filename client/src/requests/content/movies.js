import axios from "axios";
import API from '../common'

/**
 * Request to get popular movies
 * @param id user id
 * @returns {Promise<>}
 */
const popular = (id) => {
    return axios.get(API + '/tmdb/movies/popular',{params:{ userId: id}})
}

/**
 * Request to get top rated movies
 * @param id user id
 * @returns {Promise<>}
 */
const topRated = (id) => {
    return axios.get(API + '/tmdb/movies/top_rated', {params:{ userId: id}})
}

/**
 * Request to get upcoming movies
 * @param id user id
 * @returns {Promise<>}
 */
const upcoming = (id) => {
    return axios.get(API + '/tmdb/movies/upcoming',{params:{ userId: id}})
}

/**
 * Request to search specific movie
 * @param id user id
 * @param data name movie
 * @returns {Promise<>}
 */
const search = (data, id) => {
    return axios.get(API + '/tmdb/movies/search', {params: {query: data, userId: id}})
}

export const requestMovies = {popular, topRated, upcoming, search};
