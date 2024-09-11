import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

import Login from './Login.tsx';  // Or import App if you want to switch back later

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {DialogProvider} from "./DialogContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter> {/* Add the Router here */}
            <DialogProvider>
                <Login /> {/* Render the Login component */}
            </DialogProvider>
        </BrowserRouter>
    </React.StrictMode>
);

