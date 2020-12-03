import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from "./constants/apiConstants";

axios.defaults.baseURL = API_BASE_URL;
if (localStorage.getItem(ACCESS_TOKEN_NAME)) {
	axios.defaults.headers = {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)};
}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
