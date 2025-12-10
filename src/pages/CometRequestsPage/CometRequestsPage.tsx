import { FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loadUserRequests, loadCurrentRequest } from '../../store/slices/requestsSlice'
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
    const { userRequests, loading, error, currentRequest } = useAppSelector(state => {
        return {
            userRequests: state.requests.userRequests,
            loading: state.requests.loading,
            error: state.requests.error,
            currentRequest: state.requests.currentRequest,
        }
    })

    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        dispatch(loadUserRequests())
        dispatch(loadCurrentRequest())
    }, [dispatch])

    const combinedRequests = useMemo(() => {
        if (currentRequest && currentRequest.status === 'draft') {
            const exists = userRequests.some(r => r.id === currentRequest.id)
            return exists ? userRequests : [currentRequest, ...userRequests]
        }
        return userRequests
    }, [userRequests, currentRequest])

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') {
            return combinedRequests
        }
        return combinedRequests.filter(request => request.status === statusFilter)
    }, [combinedRequests, statusFilter])

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
                    <h1>Мои заявки на кометы</h1>
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
                                <p>У вас пока нет заявок на кометы</p>
                            </div>
                        ) : (
                            <div className="cards-grid">
                                {filteredRequests.map((request) => (
                                    <div key={request.id} className="order-card">
                                        <div className="card-header">
                                            <div>
                                                <div className="card-id">Заявка #{request.id}</div>
                                                <div className="card-date">{formatDate(request.created_at)}</div>
                                            </div>
                                            <span className={`status-badge ${STATUS_COLORS[request.status as keyof typeof STATUS_COLORS]}`}>
                                                {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                                            </span>
                                        </div>

                                        <div className="card-info">
                                            <span>Позиций: {getTotalItems(request)}</span>
                                            {request.calculated_comets_count !== undefined && (
                                                <span>Рассчитано: {request.calculated_comets_count}</span>
                                            )}
                                        </div>

                                        <div className="card-results">
                                            <div className="results-title">Результат</div>
                                            {request.distance_comets && request.distance_comets.length > 0 ? (
                                                <ul className="results-list">
                                                    {request.distance_comets.map((c: any) => (
                                                        <li key={c.id}>
                                                            <span className="comet-name">{c.comet?.name || 'Комета'}</span>
                                                            <span className="comet-distance">
                                                                {c.distance_au !== null && c.distance_au !== undefined
                                                                    ? `${c.distance_au} а.е.`
                                                                    : '—'}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="results-empty">Нет комет в заявке</div>
                                            )}
                                        </div>

                                        <div className="card-actions">
                                            <Link
                                                to={`${ROUTES.TRAJECTORY_CALCULATION.replace(':id', request.id.toString())}`}
                                                className="btn btn-light"
                                            >
                                                Просмотр
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
