import {createSlice} from '@reduxjs/toolkit';

/**
 * User reducer
 */
export const user = createSlice({
    name: 'user',
    initialState: {
        email: undefined,
        username: undefined,
        name: undefined,
        _id: undefined
    },
    reducers: {
        /**
         * Set user data
         * @param state current state
         * @param action payload
         */
        signUpSuccess: (state, action) => {
            const {email, name, username} = action.payload
            return {
                ...state,
                name: name,
                email: email,
                username: username
            }
        },
        /**
         * Set user data
         * @param state current state
         * @param action payload
         */
        signInSuccess: (state, action) => {
            const {email, name, username, _id} = action.payload
            return {
                ...state,
                _id: _id,
                name: name,
                username: username,
                email: email
            }
        },
        /**
         * Reset user data (log out)
         * @param state current state
         */
        resetUser: (state) => {
            return {
                ...state,
                email: undefined,
                username: undefined,
                name: undefined,
                _id: undefined
            }
        },
        /**
         * Change user data
         * @param state current state
         * @param action payload
         */
        changeData: (state, action) => {
            const {name, username, email} = action.payload
            return {
                ...state,
                name: name,
                username: username,
                email: email
            }
        }
    }
});

export const {signUpSuccess, signInSuccess, resetUser, changeData} = user.actions;

export default user.reducer;





