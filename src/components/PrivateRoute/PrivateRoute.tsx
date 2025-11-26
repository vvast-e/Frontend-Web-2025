import { FC, ReactNode } from 'react'
import { useAppSelector } from '../../store/hooks'
import { ROUTES } from '../../Routes'

interface PrivateRouteProps {
    children: ReactNode
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAppSelector(state => state.auth)

    // Показываем загрузку пока проверяем авторизацию
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
            }}>
                <div>Загрузка...</div>
            </div>
        )
    }

    // Если не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated) {
        window.location.href = ROUTES.LOGIN
        return null
    }

    // Если авторизован, показываем защищенный контент
    return <>{children}</>
}




