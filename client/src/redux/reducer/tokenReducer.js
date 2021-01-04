import {createSlice} from '@reduxjs/toolkit';

/**
 * Token reducer
 */
export const token = createSlice({
    name: 'token',
    initialState: {
        email: undefined,
        signIn: undefined,
    },
    reducers: {
        /**
         * Set token email
         * @param state current state
         * @param action payload
         */
        setTokenEmail: (state, action) => {
            return {
                ...state,
                email: action.payload
            }
        },
        /**
         * Set sign in information
         * @param state current state
         * @param action payload
         */
        meFromTokenSuccess: (state, action) => {
            return {
                ...state,
                email: undefined,
                signIn: action.payload,
            }
        },
        /**
         * Reset token reducer
         * @param state current state
         */
        meFromTokenFailure: (state) => {
            return {
                ...state,
                email: undefined,
                signIn: undefined,
            }
        },
        /**
         * Reset sign in information
         * @param state current state
         */
        deleteToken: (state) => {
            return {
                ...state,
                signIn: undefined
            }
        }
    }
});

export const {setTokenEmail, meFromTokenFailure, meFromTokenSuccess, deleteToken} = token.actions;

export default token.reducer;

