

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; 
import './index.css'
import { FirebaseCartProvider } from './context/FirebaseCartContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> 
      <FirebaseCartProvider>
      <App />

      </FirebaseCartProvider>
    </AuthProvider>
  </React.StrictMode>
);
