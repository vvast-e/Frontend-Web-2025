import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './pages/HomePage/HomePage'
import { CometsPage } from './pages/CometsPage/CometsPage'
import { CometDetailPage } from './pages/CometDetailPage/CometDetailPage'
import { ROUTES } from './Routes'
import './App.css'

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.COMETS} element={<CometsPage />} />
                    <Route path={ROUTES.COMET_DETAIL} element={<CometDetailPage />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>Тема: Расстояние кометы от Солнца по её координатам на небесной сфере</p>
            </footer>
        </div>
    )
}

export default App



