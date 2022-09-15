import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import { Provider } from 'react-redux';
import store from './store';

// Styles
import "./Static/css/bootstrap.min.css";
import "./Static/css/animate.css";
import "./Static/css/icons.css";
import 'react-notifications-component/dist/theme.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import "./Static/css/metisMenu.min.css";
import "./Static/css/extra.css";
import "./Static/css/app.css";

import './i18n';

ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
    document.getElementById("root")
);


serviceWorker.unregister();