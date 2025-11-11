import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { registerSW } from 'virtual:pwa-register'
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

if ('serviceWorker' in navigator) {
    registerSW({
        onNeedRefresh() {
            console.log('New content available, please refresh.')
        },
        onOfflineReady() {
            console.log('App ready to work offline')
        },
    })
}



