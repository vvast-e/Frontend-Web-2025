import { FC, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginUser, clearError } from '../../store/slices/authSlice'
import { clearAllFilters } from '../../store/slices/filtersSlice'
import { clearCurrentRequest } from '../../store/slices/requestsSlice'
import { ROUTES } from '../../Routes'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import './LoginPage.css'

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error, isAuthenticated } = useAppSelector(state => state.auth)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.COMETS)
        }
    }, [isAuthenticated, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(clearError())

        try {
            await dispatch(loginUser(formData)).unwrap()
            // При успешной авторизации сбрасываем фильтры и заявку
            dispatch(clearAllFilters())
            dispatch(clearCurrentRequest())
            navigate(ROUTES.COMETS)
        } catch (error) {
            // Ошибка обрабатывается в slice
        }
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.LOGIN }]} />
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <h1>Вход в систему</h1>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-red auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" />
                                    Вход...
                                </>
                            ) : (
                                'Войти'
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        <p>
                            Нет аккаунта?{' '}
                            <Link to={ROUTES.REGISTER} className="auth-link">
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}




