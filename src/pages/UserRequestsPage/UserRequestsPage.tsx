import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { getRequestList } from '../../store/slices/requestSlice';
import { ROUTES } from '../../Routes';
import './UserRequestsPage.css';

const UserRequestsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const request = useSelector((state: RootState) => state.request);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFromFilter, setDateFromFilter] = useState<string>('');

    useEffect(() => {
        dispatch(getRequestList({ status: statusFilter || undefined, date_from: dateFromFilter || undefined }));
    }, [dispatch, statusFilter, dateFromFilter]);

    const handleRequestClick = (requestId: number) => {
        navigate(`${ROUTES.REQUEST}/${requestId}`);
    };

    const getStatusLabel = (status: string | undefined) => {
        console.log('getStatusLabel called with:', status, 'type:', typeof status);
        if (!status) {
            console.log('Status is empty, returning "-"');
            return '-';
        }
        const labels: { [key: string]: string } = {
            draft: 'Черновик',
            formed: 'Сформирована',
            completed: 'Завершена',
            rejected: 'Отклонена',
        };
        const result = labels[status] || status;
        console.log('getStatusLabel result:', result);
        return result;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
                <Container style={{ maxWidth: '1200px', marginTop: '50px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Мои заявки</h2>

                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Form.Group style={{ marginBottom: 0, width: '200px' }}>
                            <Form.Label>Статус</Form.Label>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Все</option>
                                <option value="draft">Черновик</option>
                                <option value="formed">Сформирована</option>
                                <option value="completed">Завершена</option>
                                <option value="rejected">Отклонена</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{ marginBottom: 0, width: '200px' }}>
                            <Form.Label>Дата формирования от</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFromFilter}
                                onChange={(e) => setDateFromFilter(e.target.value)}
                            />
                        </Form.Group>
                    </div>

                    {request.loading && <Spinner />}
                    {request.error && <Alert variant="danger">{request.error}</Alert>}

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Статус</th>
                                <th>Дата создания</th>
                                <th>Дата формирования</th>
                                <th>Дата завершения</th>
                                <th>Количество услуг</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.requestList.length > 0 ? (
                                request.requestList.map((req) => {
                                    console.log('Request item:', req, 'Status:', req.status, 'Status type:', typeof req.status);
                                    return (
                                    <tr key={req.id}>
                                        <td>{req.id}</td>
                                        <td>{getStatusLabel(req.status)}</td>
                                        <td>{formatDate(req.created_at)}</td>
                                        <td>{formatDate(req.formed_at)}</td>
                                        <td>{formatDate(req.completed_at)}</td>
                                        <td>{req.calculated_comets_count || req.distance_comets?.length || 0}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleRequestClick(req.id)}
                                            >
                                                Просмотр
                                            </Button>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>
                                        Заявки не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Container>
            </Container>
    );
};

export default UserRequestsPage;

