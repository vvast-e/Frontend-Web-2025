import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import {
  getRequest,
  updateRequest,
  deleteRequest,
  formRequest,
  deleteCometFromRequest,
  updateCometInRequest,
  getRequestList,
} from '../../store/slices/requestSlice';
import { ROUTES } from '../../Routes';
import './TrajectoryCalculationPage.css';

interface CometCoords {
  x: number;
  y: number;
  z: number;
}

const TrajectoryCalculationPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const request = useSelector((state: RootState) => state.request);
    const [telescopesList, setTelescopesList] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingCoords, setEditingCoords] = useState<Record<number, CometCoords>>({});
    const [editingCometId, setEditingCometId] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(getRequest(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (request.requestData.telescopes_list) {
            setTelescopesList(request.requestData.telescopes_list.join(', '));
        }
    }, [request.requestData.telescopes_list]);

    useEffect(() => {
        // Инициализируем локальное состояние координат для каждой кометы
        const coords: Record<number, CometCoords> = {};
        request.distance_comets.forEach((item) => {
            if (item.comet?.id) {
                coords[item.comet.id] = {
                    x: item.coords_x || 0,
                    y: item.coords_y || 0,
                    z: item.coords_z || 0,
                };
            }
        });
        setEditingCoords(coords);
    }, [request.distance_comets]);

    const handleTelescopesChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTelescopesList(e.target.value);
    };

    const handleSave = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const telescopesArray = telescopesList.split(',').map(t => t.trim()).filter(t => t);
            await dispatch(updateRequest({
                requestId: id,
                data: { telescopes_list: telescopesArray },
            })).unwrap();
        } catch (err: any) {
            setError(err || 'Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm('Вы уверены, что хотите удалить заявку?')) return;
        setLoading(true);
        try {
            await dispatch(deleteRequest(id)).unwrap();
            navigate(ROUTES.MY_REQUESTS);
        } catch (err: any) {
            setError(err || 'Ошибка при удалении');
        } finally {
            setLoading(false);
        }
    };

    const handleForm = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            await dispatch(formRequest(id)).unwrap();
            // Обновляем список заявок перед редиректом
            await dispatch(getRequestList({})).unwrap();
            navigate(ROUTES.MY_REQUESTS);
        } catch (err: any) {
            setError(err || 'Ошибка при формировании заявки');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComet = async (cometId: number) => {
        if (!id) return;
        setLoading(true);
        try {
            await dispatch(deleteCometFromRequest({
                requestId: parseInt(id),
                cometId,
            })).unwrap();
            dispatch(getRequest(id));
        } catch (err: any) {
            setError(err || 'Ошибка при удалении услуги');
        } finally {
            setLoading(false);
        }
    };

    const handleEditComet = (cometId: number) => {
        // Находим комету в заявке
        const item = request.distance_comets.find(dc => dc.comet?.id === cometId);
        if (item && item.comet?.id) {
            // Инициализируем координаты для редактирования
            setEditingCoords((prev) => ({
                ...prev,
                [item.comet.id!]: {
                    x: item.coords_x || 0,
                    y: item.coords_y || 0,
                    z: item.coords_z || 0,
                },
            }));
        }
        // Активируем режим редактирования для этой кометы
        setEditingCometId(cometId);
    };

    const handleUpdateComet = async (cometId: number) => {
        if (!id) return;
        const coords = editingCoords[cometId];
        if (!coords) return;
        
        setLoading(true);
        try {
            await dispatch(updateCometInRequest({
                requestId: parseInt(id),
                cometId,
                data: {
                    coords_x: coords.x,
                    coords_y: coords.y,
                    coords_z: coords.z,
                },
            })).unwrap();
            setEditingCometId(null); // Отключаем режим редактирования после сохранения
            dispatch(getRequest(id));
        } catch (err: any) {
            setError(err || 'Ошибка при обновлении координат');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = (cometId: number) => {
        // Отменяем редактирование и восстанавливаем исходные значения
        const item = request.distance_comets.find(dc => dc.comet?.id === cometId);
        if (item && item.comet?.id) {
            setEditingCoords((prev) => ({
                ...prev,
                [item.comet.id!]: {
                    x: item.coords_x || 0,
                    y: item.coords_y || 0,
                    z: item.coords_z || 0,
                },
            }));
        }
        setEditingCometId(null);
    };

    const handleCoordsChange = (cometId: number, field: 'x' | 'y' | 'z', value: number) => {
        setEditingCoords((prev) => ({
            ...prev,
            [cometId]: {
                ...prev[cometId],
                [field]: value,
            },
        }));
    };

    const isDraft = request.isDraft;

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
                <Container style={{ maxWidth: '1200px', marginTop: '50px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Заявка на расчет траектории</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {request.loading && <Spinner />}

                    <Form.Group controlId="telescopes" style={{ marginBottom: '20px' }}>
                        <Form.Label>Список телескопов (через запятую)</Form.Label>
                        <Form.Control
                            type="text"
                            value={telescopesList}
                            onChange={handleTelescopesChange}
                            disabled={!isDraft}
                            placeholder="Введите список телескопов через запятую"
                        />
                    </Form.Group>

                    {isDraft && (
                        <div className="request-actions" style={{ marginBottom: '20px' }}>
                            <Button variant="primary" onClick={handleSave} disabled={loading} className="request-action-btn">
                                Сохранить
                            </Button>
                            <Button variant="success" onClick={handleForm} disabled={loading} className="request-action-btn">
                                Сформировать заявку
                            </Button>
                            <Button variant="danger" onClick={handleDelete} disabled={loading} className="request-action-btn">
                                Удалить заявку
                            </Button>
                        </div>
                    )}

                    <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Услуги в заявке</h3>
                    <Table className="comets-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>X</th>
                                <th>Y</th>
                                <th>Z</th>
                                <th>Расстояние (а.е.)</th>
                                {isDraft && <th>Действия</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {request.distance_comets.map((item, index) => (
                                <tr key={index}>
                                    <td className="comet-name-cell">{item.comet?.name || '-'}</td>
                                    <td className="comet-price-cell">{item.comet?.price || '-'} ₽</td>
                                    <td>
                                        {isDraft ? (
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={
                                                    item.comet?.id && editingCometId === item.comet.id
                                                        ? ((editingCoords[item.comet.id]?.x ?? item.coords_x) || 0)
                                                        : (item.coords_x || 0)
                                                }
                                                onChange={(e) => {
                                                    if (item.comet?.id) {
                                                        handleCoordsChange(item.comet.id, 'x', parseFloat(e.target.value) || 0);
                                                    }
                                                }}
                                                disabled={editingCometId !== item.comet?.id}
                                                className="coord-input"
                                            />
                                        ) : (
                                            item.coords_x !== null && item.coords_x !== undefined ? Number(item.coords_x).toFixed(2) : '-'
                                        )}
                                    </td>
                                    <td>
                                        {isDraft ? (
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={
                                                    item.comet?.id && editingCometId === item.comet.id
                                                        ? ((editingCoords[item.comet.id]?.y ?? item.coords_y) || 0)
                                                        : (item.coords_y || 0)
                                                }
                                                onChange={(e) => {
                                                    if (item.comet?.id) {
                                                        handleCoordsChange(item.comet.id, 'y', parseFloat(e.target.value) || 0);
                                                    }
                                                }}
                                                disabled={editingCometId !== item.comet?.id}
                                                className="coord-input"
                                            />
                                        ) : (
                                            item.coords_y !== null && item.coords_y !== undefined ? Number(item.coords_y).toFixed(2) : '-'
                                        )}
                                    </td>
                                    <td>
                                        {isDraft ? (
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={
                                                    item.comet?.id && editingCometId === item.comet.id
                                                        ? ((editingCoords[item.comet.id]?.z ?? item.coords_z) || 0)
                                                        : (item.coords_z || 0)
                                                }
                                                onChange={(e) => {
                                                    if (item.comet?.id) {
                                                        handleCoordsChange(item.comet.id, 'z', parseFloat(e.target.value) || 0);
                                                    }
                                                }}
                                                disabled={editingCometId !== item.comet?.id}
                                                className="coord-input"
                                            />
                                        ) : (
                                            item.coords_z !== null && item.coords_z !== undefined ? Number(item.coords_z).toFixed(2) : '-'
                                        )}
                                    </td>
                                    <td className="distance-cell">
                                        {item.distance_au !== null && item.distance_au !== undefined ? Number(item.distance_au).toFixed(4) : '-'}
                                    </td>
                                    {isDraft && (
                                        <td className="actions-cell">
                                            {editingCometId === item.comet?.id ? (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => item.comet?.id && handleUpdateComet(item.comet.id)}
                                                        disabled={loading}
                                                        className="action-btn"
                                                    >
                                                        Сохранить
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => item.comet?.id && handleCancelEdit(item.comet.id)}
                                                        disabled={loading}
                                                        className="action-btn"
                                                    >
                                                        Отмена
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => item.comet?.id && handleEditComet(item.comet.id)}
                                                        disabled={loading || editingCometId !== null}
                                                        className="action-btn"
                                                    >
                                                        Изменить
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => item.comet?.id && handleDeleteComet(item.comet.id)}
                                                        disabled={loading || editingCometId !== null}
                                                        className="action-btn"
                                                    >
                                                        Удалить
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Container>
    );
};

export default TrajectoryCalculationPage;

