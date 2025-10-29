import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../Routes'
import './Navbar.css'

export const Navbar: FC = () => {
    return (
        <header className="app-header">
            <Link to={ROUTES.HOME} className="home-link">
                Главная
            </Link>
            <Link to={ROUTES.COMETS} className="home-link">
                Кометы
            </Link>
        </header>
    )
}



