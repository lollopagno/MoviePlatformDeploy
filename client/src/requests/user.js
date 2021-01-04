import axios from "axios";
import API from './common'

/**
 * Request to sign up
 * @param user data
 * @returns {Promise<>}
 */
const signUp = (user) => {
    return axios.post(API + '/user/new_user', user)
}

/**
 * Request to check if exist the same value in the db
 * @param field name
 * @param data to check
 * @returns {Promise<>}
 */
const sameField = (field, data) => {
    return axios.get(API + '/user/same_field', {params: {field: field, data: data}})
}

/**
 * Request to check if the value is unique in the db
 * @param field name
 * @param data to check
 * @param userId user id
 * @returns {Promise<>}
 */
const sameFieldExceptUser = (field, data, userId) => {
    return axios.get(API + '/user/not_same_field', {params: {field: field, data: data, id: userId}})
}

/**
 * Check if the email is valid
 * @param email
 * @returns {Promise<>}
 */
const isValidEmail = email => {
    return axios.get(API + '/email/validation', {params: {email: email}})
}

/**
 * Request to sign in
 * @param credential to authentication
 * @returns {Promise<>}
 */
const signIn = (credential) => {
    return axios.post(API + '/user/sign_in', credential)
}

/**
 * Request to updated user data
 * @param userId user id
 * @param name
 * @param username
 * @param email
 * @returns {Promise<>}
 */
const updateUserData = (userId, name, username, email) => {
    return axios.put(API + '/user/change_data', {userId: userId, name: name, username: username, email: email})
}

/**
 * Request to delete user
 * @param userId user id
 * @returns {Promise<>}
 */
const deleteUser = (userId) => {
    return axios.delete(API + '/user/delete_account', {data: {userId: userId}})
}

/**
 * Check if the email is format valid
 */
async function isEmailFormatValid(email) {
    const res = await isValidEmail(email)
    return [res.data.email, res.data.message]
}

/**
 * Check if the email is already present
 */
async function isEmailValid(email, checkIsPresent, userId) {

    if (checkIsPresent) {
        const users = await sameField("email", email)
        const usernameDb = users.data.data
        if (usernameDb !== []) {
            if (usernameDb.email === email) {
                return false
            }
        }
        return true
    } else {
        const users = await sameFieldExceptUser("email", email, userId)
        return users.data.data.length === 0
    }

}

/**
 * Check if the username is already present
 */
async function isUserValid(username, checkPresent, userId) {

    if (checkPresent) {
        const users = await sameField("username", username)
        const usernameDb = users.data.data
        if (usernameDb !== []) {
            if (usernameDb.username === username) {
                return false
            }
        }
        return true
    } else {
        const users = await sameFieldExceptUser("username", username, userId)
        return users.data.data.length === 0
    }
}


export const request = {signUp, signIn, isEmailValid, isUserValid, isEmailFormatValid, updateUserData, deleteUser};
