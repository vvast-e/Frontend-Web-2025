import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { logoutUserAsync } from '../../store/slices/userSlice'
import { resetFilters } from '../../store/slices/filtersSlice'
import { ROUTES } from '../../Routes'
import './Navbar.css'

export const Navbar: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)
    const username = useSelector((state: RootState) => state.user.username)
    const is_superuser = useSelector((state: RootState) => state.user.is_superuser)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const handleLogout = async () => {
        await dispatch(logoutUserAsync())
        dispatch(resetFilters())
        navigate(ROUTES.HOME)
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
                {isAuthenticated && (
                    <>
                        <Link to={ROUTES.MY_REQUESTS} className="home-link">
                            Мои заявки
                        </Link>
                        <Link to={ROUTES.PROFILE} className="home-link">
                            Личный кабинет
                        </Link>
                        {is_superuser && (
                            <Link to={ROUTES.MODERATOR_REQUESTS} className="home-link">
                                Заявки (модератор)
                            </Link>
                        )}
                        <span className="home-link" style={{ marginRight: '10px' }}>
                            {username}
                        </span>
                        <button onClick={handleLogout} className="btn btn-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Выйти
                        </button>
                    </>
                )}
                {!isAuthenticated && (
                    <Link to={ROUTES.LOGIN} className="home-link">
                        Войти
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
                {isAuthenticated && (
                    <>
                        <Link to={ROUTES.MY_REQUESTS} className="home-link" onClick={closeMobileMenu}>
                            Мои заявки
                        </Link>
                        <Link to={ROUTES.PROFILE} className="home-link" onClick={closeMobileMenu}>
                            Личный кабинет
                        </Link>
                        {is_superuser && (
                            <Link to={ROUTES.MODERATOR_REQUESTS} className="home-link" onClick={closeMobileMenu}>
                                Заявки (модератор)
                            </Link>
                        )}
                        <span className="home-link" onClick={closeMobileMenu}>
                            {username}
                        </span>
                        <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="btn btn-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Выйти
                        </button>
                    </>
                )}
                {!isAuthenticated && (
                    <Link to={ROUTES.LOGIN} className="home-link" onClick={closeMobileMenu}>
                        Войти
                    </Link>
                )}
            </div>
        </header>
    )
}



