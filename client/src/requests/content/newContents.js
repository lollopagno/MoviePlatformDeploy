import axios from "axios";
import FormData from 'form-data'
import API from '../common'

/**
 * Request to added new content
 * @param userId user id
 * @param data contet data
 * @param category content
 * @returns {Promise<>}
 */
const addData = (userId, data, category) => {

    return axios.post(API + '/tmdb/new_content/add', {
        _userId: userId,
        category: category,
        section: data.section,
        title: data.title,
        date: data.date,
        language: data.language,
        department: data.department,
        vote: data.vote === undefined ? data.popularity : data.vote,
    })
}

/**
 * Request to added image to the new content
 * @param idImg id image
 * @param img image
 * @returns {Promise<>}
 */
const addImage = (idImg, img) => {
    const dataImg = new FormData();
    dataImg.append('img', img, img.name);

    return axios.put(API + '/tmdb/new_content/update', dataImg, {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            '_id' : idImg,
            'Content-Type': `multipart/form-data; boundary=${dataImg._boundary}`,
        }
    })
}

export const requestNewContents = {addData, addImage};
