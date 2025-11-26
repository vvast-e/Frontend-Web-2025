import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { ROUTES } from '../../Routes'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import './RegisterPage.css'

export const RegisterPage: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error } = useAppSelector(state => state.auth)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [validationError, setValidationError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setValidationError(null)
    }

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают')
            return false
        }

        if (formData.password.length < 6) {
            setValidationError('Пароль должен содержать минимум 6 символов')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(clearError())
        setValidationError(null)

        if (!validateForm()) {
            return
        }

        try {
            await dispatch(registerUser({
                email: formData.email,
                password: formData.password
            })).unwrap()
            // После успешной регистрации перенаправляем на страницу входа
            navigate(ROUTES.LOGIN)
        } catch (error) {
            // Ошибка обрабатывается в slice
        }
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.REGISTER }]} />
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <h1>Регистрация</h1>

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
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Подтверждение пароля</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {(error || validationError) && (
                            <div className="error-message">
                                {validationError || error}
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
                                    Регистрация...
                                </>
                            ) : (
                                'Зарегистрироваться'
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        <p>
                            Уже есть аккаунт?{' '}
                            <Link to={ROUTES.LOGIN} className="auth-link">
                                Войти
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}




