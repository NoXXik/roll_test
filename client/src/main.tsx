import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './app/styles/index.scss'
import {BrowserRouter} from "react-router-dom";
// import {StoreProvider} from "./app/providers/StoreProvider";
import {Provider} from "react-redux";
import {store} from "./app/providers/StoreProvider/config/store";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)
