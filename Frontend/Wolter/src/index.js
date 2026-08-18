import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthorizationProvider } from "./context/AuthorizationContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <AuthorizationProvider>
            <App />
        </AuthorizationProvider>
    </React.StrictMode>
);

