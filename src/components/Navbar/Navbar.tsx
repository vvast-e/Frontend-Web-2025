import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../Routes'
import './Navbar.css'

export const Navbar: FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
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
            </div>
        </header>
    )
}



