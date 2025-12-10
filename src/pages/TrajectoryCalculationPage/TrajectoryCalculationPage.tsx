import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
    loadRequestById,
    updateCometInRequest,
    removeCometFromRequest,
    confirmRequest,
    deleteRequest
} from '../../store/slices/requestsSlice'
import { ROUTES } from '../../Routes'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import './TrajectoryCalculationPage.css'

const ASTRONOMERS_LIST = ["Судьи В. Г.", "Коваленко А. И.", "Петров С. М."]
const TELESCOPES_LIST = ["Хаббл", "Кеплер", "Джеймс Уэбб"]

export const TrajectoryCalculationPage: FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { currentRequest, loading, error } = useAppSelector(state => state.requests)

    const [editingComet, setEditingComet] = useState<number | null>(null)
    const [editForm, setEditForm] = useState({
        quantity: 1,
        coords_x: 0,
        coords_y: 0,
        coords_z: 0
    })
    const [selectedAstronomer, setSelectedAstronomer] = useState('')
    const [selectedTelescope, setSelectedTelescope] = useState('')

    useEffect(() => {
        if (id) {
            dispatch(loadRequestById(parseInt(id)))
        }
    }, [id, dispatch])

    useEffect(() => {
        if (currentRequest) {
            setSelectedAstronomer(currentRequest.astronomers_list[0] || ASTRONOMERS_LIST[0])
            setSelectedTelescope(currentRequest.telescopes_list[0] || TELESCOPES_LIST[0])
        }
    }, [currentRequest])

    if (!id) {
        return <div>Неверный ID заявки</div>
    }

    if (loading && !currentRequest) {
        return (
            <div className="loading-container">
                <Spinner animation="border" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button
                    className="btn btn-light"
                    onClick={() => navigate(ROUTES.COMET_REQUESTS)}
                >
                    Вернуться к списку
                </button>
            </div>
        )
    }

    if (!currentRequest) {
        return (
            <div className="error-container">
                <div className="error-message">Заявка не найдена</div>
                <button
                    className="btn btn-light"
                    onClick={() => navigate(ROUTES.COMET_REQUESTS)}
                >
                    Вернуться к списку
                </button>
            </div>
        )
    }

    const isDraft = currentRequest.status === 'draft'
    const canEdit = isDraft

    const handleEditComet = (comet: any) => {
        setEditingComet(comet.comet.id)
        setEditForm({
            quantity: comet.quantity,
            coords_x: comet.coords_x,
            coords_y: comet.coords_y,
            coords_z: comet.coords_z
        })
    }

    const handleSaveComet = async () => {
        if (!editingComet) return

        try {
            await dispatch(updateCometInRequest({
                requestId: currentRequest.id,
                cometId: editingComet,
                data: editForm
            })).unwrap()
            setEditingComet(null)
        } catch (error) {
            console.error('Error updating comet:', error)
        }
    }

    const handleCancelEdit = () => {
        setEditingComet(null)
    }

    const handleRemoveComet = async (cometId: number) => {
        try {
            await dispatch(removeCometFromRequest({
                requestId: currentRequest.id,
                cometId,
            })).unwrap()
        } catch (error) {
            console.error('Error removing comet:', error)
        }
    }

    const handleConfirmRequest = async () => {
        try {
            await dispatch(confirmRequest(currentRequest.id)).unwrap()
            navigate(ROUTES.COMET_REQUESTS)
        } catch (error) {
            console.error('Error confirming request:', error)
        }
    }

    const handleDeleteRequest = async () => {
        try {
            await dispatch(deleteRequest(currentRequest.id)).unwrap()
            navigate(ROUTES.COMET_REQUESTS)
        } catch (error) {
            console.error('Error deleting request:', error)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            draft: 'Черновик',
            formed: 'Сформирован',
            completed: 'Завершён',
            rejected: 'Отклонён',
            deleted: 'Удалён'
        }
        return labels[status] || status
    }

    return (
        <>
            <Breadcrumbs crumbs={[
                { label: ROUTE_LABELS.COMET_REQUESTS, path: ROUTES.COMET_REQUESTS },
                { label: `Расчет траектории #${currentRequest.id}` }
            ]} />

            <div className="order-detail-container">
                <div className="order-header">
                    <h1>Расчет траектории #{currentRequest.id}</h1>
                    <div className="order-status">
                        <span className={`status-badge status-${currentRequest.status}`}>
                            {getStatusLabel(currentRequest.status)}
                        </span>
                    </div>
                </div>

                <div className="order-info">
                    <div className="info-row">
                        <span className="label">Дата создания:</span>
                        <span className="value">{formatDate(currentRequest.created_at)}</span>
                    </div>
                    {currentRequest.formed_at && (
                        <div className="info-row">
                            <span className="label">Дата формирования:</span>
                            <span className="value">{formatDate(currentRequest.formed_at)}</span>
                        </div>
                    )}
                    <div className="info-row">
                        <span className="label">Всего позиций:</span>
                        <span className="value">{currentRequest.distance_comets.length}</span>
                    </div>
                </div>

                <div className="order-content">
                    {currentRequest.distance_comets.length === 0 ? (
                        <div className="empty-order">
                            <p>Заявка пуста</p>
                            {canEdit && (
                                <a href={ROUTES.COMETS} className="btn btn-red">
                                    Добавить кометы
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="order-items">
                            {currentRequest.distance_comets.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="item-header">
                                        <h3>{item.comet.name}</h3>
                                        {canEdit && (
                                            <div className="item-actions">
                                                {editingComet === item.comet.id ? (
                                                    <>
                                                        <button
                                                            className="btn btn-small btn-red"
                                                            onClick={handleSaveComet}
                                                            disabled={loading}
                                                        >
                                                            Сохранить
                                                        </button>
                                                        <button
                                                            className="btn btn-small btn-light"
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                        >
                                                            Отмена
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-small btn-light"
                                                            onClick={() => handleEditComet(item)}
                                                            disabled={loading}
                                                        >
                                                            Изменить
                                                        </button>
                                                        <button
                                                            className="btn btn-small btn-red"
                                                            onClick={() => handleRemoveComet(item.comet.id)}
                                                            disabled={loading}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="item-content">
                                        <div className="coords-section">
                                            <label>Координаты:</label>
                                            {editingComet === item.id ? (
                                                <div className="coords-inputs">
                                                    <input
                                                        type="number"
                                                        placeholder="X"
                                                        value={editForm.coords_x}
                                                        onChange={(e) => setEditForm(prev => ({
                                                            ...prev,
                                                            coords_x: parseFloat(e.target.value) || 0
                                                        }))}
                                                        step="0.001"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Y"
                                                        value={editForm.coords_y}
                                                        onChange={(e) => setEditForm(prev => ({
                                                            ...prev,
                                                            coords_y: parseFloat(e.target.value) || 0
                                                        }))}
                                                        step="0.001"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Z"
                                                        value={editForm.coords_z}
                                                        onChange={(e) => setEditForm(prev => ({
                                                            ...prev,
                                                            coords_z: parseFloat(e.target.value) || 0
                                                        }))}
                                                        step="0.001"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="coords-display">
                                                    X: {item.coords_x}, Y: {item.coords_y}, Z: {item.coords_z}
                                                </div>
                                            )}
                                        </div>

                                        <div className="item-meta">
                                            <span>Количество: {item.quantity}</span>
                                            <span>Порядок: {item.sort_order}</span>
                                            {item.is_main && <span className="main-badge">Главная</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="order-actions">
                    {isDraft && (
                        <>
                            <button
                                className="btn btn-red"
                                onClick={handleConfirmRequest}
                                disabled={loading || currentRequest.distance_comets.length === 0}
                            >
                                Подтвердить заявку
                            </button>
                            <button
                                className="btn btn-light"
                                onClick={handleDeleteRequest}
                                disabled={loading}
                            >
                                Удалить заявку
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

