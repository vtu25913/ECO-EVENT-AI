import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Service worker is managed by vite-plugin-pwa (registerType: 'autoUpdate')
// Manual registration removed to avoid conflicts and 404s in dev mode

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
