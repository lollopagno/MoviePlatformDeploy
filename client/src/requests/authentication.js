import axios from "axios";
import API from './common'

/**
 * Request to check if the user email is verified
 * @param data user data
 * @returns {Promise<>}
 */
const tokenEmail = (data) => {
    return axios.post(API + '/token/email/confirmation', data)
}

/**
 * Request to check if the token user is still valid
 * @param headers
 * @returns {Promise<>}
 */
const meFromToken = (headers) => {
    return axios.post(API + '/token/authentication/check', {}, headers)
}

/**
 * Request to resend email
 * @param email
 * @returns {Promise<>}
 */
const resendTokenEmail = (email) => {
    return axios.post(API + '/token/email/resend', email)
}

export const authentication = {tokenEmail, resendTokenEmail, meFromToken};
