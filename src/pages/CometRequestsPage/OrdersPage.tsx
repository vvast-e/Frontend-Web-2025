import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loadUserRequests } from '../../store/slices/requestsSlice'
import { ROUTES } from '../../Routes'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import './CometRequestsPage.css'

const STATUS_LABELS = {
    draft: 'Черновик',
    formed: 'Сформирован',
    completed: 'Завершён',
    rejected: 'Отклонён',
    deleted: 'Удалён'
}

const STATUS_COLORS = {
    draft: 'status-draft',
    formed: 'status-formed',
    completed: 'status-completed',
    rejected: 'status-rejected',
    deleted: 'status-deleted'
}

export const CometRequestsPage: FC = () => {
    const dispatch = useAppDispatch()
    const { userRequests, loading, error } = useAppSelector(state => state.requests)

    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        dispatch(loadUserRequests())
    }, [dispatch])

    const filteredRequests = statusFilter === 'all'
        ? userRequests
        : userRequests.filter(request => request.status === statusFilter)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTotalItems = (request: any) => {
        return request.distance_comets?.length || 0
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.COMET_REQUESTS }]} />
            <div className="orders-container">
                <div className="orders-header">
                    <h1>Мои заявки</h1>
                    <Link to={ROUTES.COMETS} className="btn btn-red">
                        Создать заявку
                    </Link>
                </div>

                <div className="orders-toolbar">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Фильтр по статусу:</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Все статусы</option>
                            <option value="draft">Черновики</option>
                            <option value="formed">Сформированные</option>
                            <option value="completed">Завершённые</option>
                            <option value="rejected">Отклонённые</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="loading-container">
                        <Spinner animation="border" />
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredRequests.length === 0 ? (
                            <div className="no-orders">
                                <p>У вас пока нет заявок</p>
                                <Link to={ROUTES.COMETS} className="btn btn-red">
                                    Создать первую заявку
                                </Link>
                            </div>
                        ) : (
                            <div className="orders-table-wrapper">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Дата создания</th>
                                            <th>Статус</th>
                                            <th>Позиций</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id}>
                                                <td>#{request.id}</td>
                                                <td>{formatDate(request.created_at)}</td>
                                                <td>
                                                    <span className={`status-badge ${STATUS_COLORS[request.status as keyof typeof STATUS_COLORS]}`}>
                                                        {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                                                    </span>
                                                </td>
                                                <td>{getTotalItems(request)}</td>
                                                <td>
                                                    <Link
                                                        to={`${ROUTES.TRAJECTORY_CALCULATION.replace(':id', request.id.toString())}`}
                                                        className="btn btn-small btn-light"
                                                    >
                                                        Просмотр
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}


