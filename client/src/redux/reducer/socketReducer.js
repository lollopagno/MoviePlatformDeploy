import {createSlice} from '@reduxjs/toolkit';

/**
 * Socket reducer
 */
export const socket = createSlice({
    name: 'socket',
    initialState: {
        notice: 0,
        list: []
    },
    reducers: {
        /**
         * Update your notification information
         * @param state current state
         * @param action payload
         */
        eventNotice: (state, action) => {

            const {id, title, category, username} = action.payload
            const newItem = {id: id, title: title, category: category.toLowerCase(), username: username}
            return {
                ...state,
                notice: state.notice + 1,
                list: [
                    ...state.list,
                    newItem
                ]
            }
        },
        /**
         * Reset the number of notifications
         * @param state current state
         */
        resetNotice: (state) => {
            return {
                ...state,
                notice: 0,
            }
        },
        /**
         * Reset the list of notifications
         * @param state current state
         */
        resetList: (state) => {
            return {
                ...state,
                list: []
            }
        }
    }
});

export const {eventNotice, resetNotice, resetList} = socket.actions;
export default socket.reducer;



