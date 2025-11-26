import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loadUserProfile, updateUserProfile, logoutUser } from '../../store/slices/authSlice'
import { clearAllFilters } from '../../store/slices/filtersSlice'
import { clearCurrentRequest } from '../../store/slices/requestsSlice'
import { ROUTES } from '../../Routes'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import './ProfilePage.css'

export const ProfilePage: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user, loading, error } = useAppSelector(state => state.auth)

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [updateError, setUpdateError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            dispatch(loadUserProfile())
        } else {
            setFormData(prev => ({
                ...prev,
                email: user.email
            }))
        }
    }, [user, dispatch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setUpdateError(null)
    }

    const handleEdit = () => {
        setIsEditing(true)
        setFormData({
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        })
        setUpdateError(null)
    }

    const validateForm = (): boolean => {
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            setUpdateError('Новые пароли не совпадают')
            return false
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            setUpdateError('Новый пароль должен содержать минимум 6 символов')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdateError(null)

        if (!validateForm()) {
            return
        }

        try {
            const updateData: any = { email: formData.email }

            // Если указан новый пароль, добавляем его
            if (formData.newPassword) {
                updateData.password = formData.newPassword
            }

            await dispatch(updateUserProfile(updateData)).unwrap()
            setIsEditing(false)
        } catch (error) {
            setUpdateError('Ошибка при обновлении профиля')
        }
    }

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            // Сбрасываем все данные при выходе
            dispatch(clearAllFilters())
            dispatch(clearCurrentRequest())
            navigate(ROUTES.HOME)
        } catch (error) {
            // Даже если logout на сервере не удался, очищаем локальное состояние
            dispatch(clearAllFilters())
            dispatch(clearCurrentRequest())
            navigate(ROUTES.HOME)
        }
    }

    if (loading && !user) {
        return (
            <div className="loading-container">
                <Spinner animation="border" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="profile-container">
                <p>Пользователь не найден</p>
            </div>
        )
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.PROFILE }]} />
            <div className="profile-container">
                <div className="profile-wrapper">
                    <h1>Личный кабинет</h1>

                    <div className="profile-content">
                        {!isEditing ? (
                            // Просмотр профиля
                            <div className="profile-view">
                                <div className="profile-field">
                                    <label>Email:</label>
                                    <span>{user.email}</span>
                                </div>

                                <div className="profile-field">
                                    <label>Роль:</label>
                                    <span>{user.is_staff ? 'Администратор' : 'Пользователь'}</span>
                                </div>

                                <div className="profile-actions">
                                    <button
                                        className="btn btn-red"
                                        onClick={handleEdit}
                                    >
                                        Редактировать профиль
                                    </button>
                                    <button
                                        className="btn btn-light"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Форма редактирования
                            <form className="profile-form" onSubmit={handleSubmit}>
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

                                <div className="password-section">
                                    <h3>Смена пароля (необязательно)</h3>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">Новый пароль</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            minLength={6}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmNewPassword">Подтверждение нового пароля</label>
                                        <input
                                            type="password"
                                            id="confirmNewPassword"
                                            name="confirmNewPassword"
                                            value={formData.confirmNewPassword}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {(updateError || error) && (
                                    <div className="error-message">
                                        {updateError || error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-red"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                Сохранение...
                                            </>
                                        ) : (
                                            'Сохранить'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}




