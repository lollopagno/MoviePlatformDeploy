import React, {useEffect} from 'react';
import './App.css';
import history from './history'
import {authentication} from './requests/authentication'
import {meFromTokenFailure, meFromTokenSuccess} from './redux/reducer/tokenReducer';
import {store} from './redux/store'
import {useSelector} from "react-redux";
import {resetUser} from "./redux/reducer/userReducer";
import RoutesWithToken from "./route/routesWithToken";
import RoutesWithoutToken from "./route/routesWithoutToken";
import {setAlert} from "./redux/reducer/signInReducer";

function App() {

    const token = useSelector(state => state.token.signIn)
    const headers = {headers: {'Authorization': token === undefined ? '' : 'Bearer ' + token}}

    useEffect(() => {

        console.log("[APP] USE EFFECT APP ")

        // Check if token is present
        if (token || token !== undefined) {
            console.log("[APP] THERE IS A TOKEN")

            // Check if token is valid
            authentication.meFromToken(headers).then(res => {
                store.dispatch(meFromTokenSuccess(res.data.token));

            }).catch((err) => {
                // Token expired
                console.log("[APP] ERR TOKEN EXPIRED")
                store.dispatch(meFromTokenFailure())                // Reset token redux
                store.dispatch(resetUser())                         // Reset user redux
                store.dispatch(setAlert({alert: err.response.data.message, isSuccess: false})) // Set error redux
                history.push('/')
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="App">
            {token ? <RoutesWithToken/> : <RoutesWithoutToken/>}
        </div>
    )
}

export default App;
