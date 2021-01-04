import {createSlice} from '@reduxjs/toolkit';

/**
 * Sign in reducer
 */
export const signIn = createSlice({
    name: 'signIn',
    initialState: {
        alert: undefined,
        isSuccess: undefined
    },
    reducers: {
        /**
         * Set text alert, status of the request
         * @param state current state
         * @param action payload
         */
        setAlert: (state, action) => {
            const {alert, isSuccess} = action.payload
            return {
                ...state,
                alert: alert,
                isSuccess : isSuccess
            }
        },
        /**
         * Reset reducer sign in
         * @param state current state
         */
        resetAlert: (state) => {
            return {
                ...state,
                alert: undefined,
                isSuccess : undefined
            }
        },
    }
});

export const {setAlert, resetAlert} = signIn.actions;

export default signIn.reducer;
