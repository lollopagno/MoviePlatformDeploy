import React, {useEffect} from 'react';
import './App.css';
import history from './history'
import {authentication} from './requests/authentication'
import {meFromTokenFailure, meFromTokenSuccess} from './redux/reducer/tokenReducer';
import {store} from './redux/store'
import {useSelector} from "react-redux";
import {resetUser} from "./redux/reducer/userReducer";
import Routes from "./route/route";
import {setAlert} from "./redux/reducer/signInReducer";

function App() {

    const token = useSelector(state => state.token.signIn)
    const headers = {headers: {'Authorization': token === undefined ? '' : 'Bearer ' + token}}

    useEffect(() => {

        // Check if token is present
        if (token || token !== undefined) {

            // Check if token is valid
            authentication.meFromToken(headers).then(res => {
                store.dispatch(meFromTokenSuccess(res.data.token));

            }).catch((err) => {
                // Token expired
                store.dispatch(meFromTokenFailure())                // Reset token redux
                store.dispatch(resetUser())                         // Reset user redux
                store.dispatch(setAlert({alert: err.response.data.message, isSuccess: false})) // Set error redux
                history.push('/signIn')
            });
        } else {

            const route = window.location.href.toString().split('/').pop()
            switch (route){
                case 'signUp':
                    history.push('/signUp')
                    break;
                case 'resendToken':
                    history.push('/resendToken')
                    break;
                case 'confirmation':
                    history.push('/confirmation')
                    break;
                case 'signIn' :
                case 'dashboard':
                case 'myProfile':
                case 'notification':
                    history.push('/signIn')
                    break;
                default:
                    history.push('/error')
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="App">
            {<Routes/>}
        </div>
    )
}

export default App;
