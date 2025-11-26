import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { HomePage } from './pages/HomePage/HomePage'
import { CometsPage } from './pages/CometsPage/CometsPage'
import { CometDetailPage } from './pages/CometDetailPage/CometDetailPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { RegisterPage } from './pages/RegisterPage/RegisterPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { CometRequestsPage } from './pages/CometRequestsPage/CometRequestsPage'
import { TrajectoryCalculationPage } from './pages/TrajectoryCalculationPage/TrajectoryCalculationPage'
import { ROUTES } from './Routes'
import './App.css'

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTES.COMETS} element={<CometsPage />} />
                    <Route path={ROUTES.COMET_DETAIL} element={<CometDetailPage />} />
                    <Route path={ROUTES.PROFILE} element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />
                    <Route path={ROUTES.COMET_REQUESTS} element={
                        <PrivateRoute>
                            <CometRequestsPage />
                        </PrivateRoute>
                    } />
                    <Route path={ROUTES.TRAJECTORY_CALCULATION} element={
                        <PrivateRoute>
                            <TrajectoryCalculationPage />
                        </PrivateRoute>
                    } />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>Тема: Расстояние кометы от Солнца по её координатам на небесной сфере</p>
            </footer>
        </div>
    )
}

export default App



