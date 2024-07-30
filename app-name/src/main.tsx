import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {DialogProvider} from "./DialogContext.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DialogProvider>
            <App/>
        </DialogProvider>
    </React.StrictMode>
);
