import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { dest_root } from './config/target_config'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={dest_root}>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)

// Service worker не используется в Tauri

