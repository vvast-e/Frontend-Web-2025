import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logoutUser } from '../../store/slices/authSlice'
import { clearAllFilters } from '../../store/slices/filtersSlice'
import { clearCurrentRequest } from '../../store/slices/requestsSlice'
import { ROUTES } from '../../Routes'
import './Navbar.css'

export const Navbar: FC = () => {
    const dispatch = useAppDispatch()
    const { isAuthenticated, userEmail } = useAppSelector(state => state.auth)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            // Сбрасываем все данные при выходе
            dispatch(clearAllFilters())
            dispatch(clearCurrentRequest())
        } catch (error) {
            // Даже если logout на сервере не удался, очищаем локальное состояние
            dispatch(clearAllFilters())
            dispatch(clearCurrentRequest())
        }
        closeMobileMenu()
    }

    return (
        <header className="app-header">
            <div className="nav-desktop">
                <Link to={ROUTES.HOME} className="home-link">
                    Главная
                </Link>
                <Link to={ROUTES.COMETS} className="home-link">
                    Кометы
                </Link>

                {isAuthenticated ? (
                    <div className="nav-actions">
                        <Link to={ROUTES.PROFILE} className="home-link">
                            {userEmail || 'Пользователь'}
                        </Link>
                        <button
                            className="home-link logout-btn"
                            onClick={handleLogout}
                        >
                            Выход
                        </button>
                    </div>
                ) : (
                    <Link to={ROUTES.LOGIN} className="home-link">
                        Вход
                    </Link>
                )}
            </div>

            <div
                className={`nav-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to={ROUTES.HOME} className="home-link" onClick={closeMobileMenu}>
                    Главная
                </Link>
                <Link to={ROUTES.COMETS} className="home-link" onClick={closeMobileMenu}>
                    Кометы
                </Link>

                {isAuthenticated ? (
                    <div className="mobile-user-info">
                        <Link to={ROUTES.PROFILE} className="home-link" onClick={closeMobileMenu}>
                            {userEmail || 'Пользователь'}
                        </Link>
                        <button
                            className="home-link logout-btn"
                            onClick={handleLogout}
                        >
                            Выход
                        </button>
                    </div>
                ) : (
                    <Link to={ROUTES.LOGIN} className="home-link" onClick={closeMobileMenu}>
                        Вход
                    </Link>
                )}
            </div>
        </header>
    )
}



