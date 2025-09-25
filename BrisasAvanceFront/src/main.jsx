import React from 'react'
import ReactDOM from 'react-dom/client'
// Cambiamos la importación: apuntamos al componente que pegaste
import Dashboard from './components/inicio.jsx'
import './index.css' // deja esto si existe

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
)
