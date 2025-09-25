import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Importamos App que ya tiene Router configurado
import './index.css';         // Si tienes estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
