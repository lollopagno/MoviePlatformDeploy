import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {store, persistence} from "./redux/store";
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistence}>
            <Router>
                <App/>
            </Router>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();
