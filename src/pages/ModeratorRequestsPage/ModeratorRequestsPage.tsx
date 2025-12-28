import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getModeratorRequestsList, completeRequest, setDateFrom, setDateTo, setStatusFilter, setCreatorFilter } from '../../store/slices/moderatorSlice';
import './ModeratorRequestsPage.css';

const ModeratorRequestsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const moderator = useSelector((state: RootState) => state.moderator);

    useEffect(() => {
        // Первоначальная загрузка
        const params: any = {};
        if (moderator.filters.date_from) {
            params.date_from = moderator.filters.date_from;
        }
        if (moderator.filters.date_to) {
            params.date_to = moderator.filters.date_to;
        }
        if (moderator.filters.status) {
            params.status = moderator.filters.status;
        }
        dispatch(getModeratorRequestsList(params));

        // Short polling - обновление каждые 2-3 секунды
        const interval = setInterval(() => {
            dispatch(getModeratorRequestsList(params));
        }, 2500); // 2.5 секунды

        return () => {
            clearInterval(interval);
        };
    }, [dispatch, moderator.filters.date_from, moderator.filters.date_to, moderator.filters.status]);

    const handleComplete = async (requestId: number) => {
        await dispatch(completeRequest({ requestId: requestId.toString(), action: 'complete' }));
    };

    const handleReject = async (requestId: number) => {
        await dispatch(completeRequest({ requestId: requestId.toString(), action: 'reject' }));
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDateFrom(e.target.value));
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDateTo(e.target.value));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStatusFilter(e.target.value));
    };

    const handleCreatorFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setCreatorFilter(e.target.value));
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            draft: 'Черновик',
            formed: 'Сформирована',
            completed: 'Завершена',
            rejected: 'Отклонена',
        };
        return labels[status] || status;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    // Фильтрация по создателю на фронтенде
    const filteredRequests = moderator.requests.filter((req) => {
        if (moderator.filters.creator_filter) {
            return req.astronomer_login?.toLowerCase().includes(moderator.filters.creator_filter.toLowerCase());
        }
        return true;
    });

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
                <Container style={{ maxWidth: '1400px', marginTop: '50px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Заявки (модератор)</h2>

                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <Form.Group style={{ marginBottom: 0, width: '150px' }}>
                            <Form.Label>Дата формирования от</Form.Label>
                            <Form.Control
                                type="date"
                                value={moderator.filters.date_from}
                                onChange={handleDateFromChange}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: 0, width: '150px' }}>
                            <Form.Label>Дата формирования до</Form.Label>
                            <Form.Control
                                type="date"
                                value={moderator.filters.date_to}
                                onChange={handleDateToChange}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: 0, width: '150px' }}>
                            <Form.Label>Статус</Form.Label>
                            <Form.Select
                                value={moderator.filters.status}
                                onChange={handleStatusChange}
                            >
                                <option value="">Все</option>
                                <option value="draft">Черновик</option>
                                <option value="formed">Сформирована</option>
                                <option value="completed">Завершена</option>
                                <option value="rejected">Отклонена</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{ marginBottom: 0, width: '200px' }}>
                            <Form.Label>Создатель (фильтр на фронтенде)</Form.Label>
                            <Form.Control
                                type="text"
                                value={moderator.filters.creator_filter}
                                onChange={handleCreatorFilterChange}
                                placeholder="Поиск по создателю"
                            />
                        </Form.Group>
                    </div>

                    {moderator.loading && <Spinner />}
                    {moderator.error && <Alert variant="danger">{moderator.error}</Alert>}

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Статус</th>
                                <th>Дата создания</th>
                                <th>Дата формирования</th>
                                <th>Дата завершения</th>
                                <th>Создатель</th>
                                <th>Главный астроном</th>
                                <th>Количество услуг</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>{req.id}</td>
                                        <td>{getStatusLabel(req.status)}</td>
                                        <td>{formatDate(req.created_at)}</td>
                                        <td>{formatDate(req.formed_at)}</td>
                                        <td>{formatDate(req.completed_at)}</td>
                                        <td>{req.astronomer_login || '-'}</td>
                                        <td>{req.chief_astronomer_login || '-'}</td>
                                        <td>{req.calculated_comets_count || req.distance_comets?.length || 0}</td>
                                        <td>
                                            {req.status === 'formed' && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleComplete(req.id)}
                                                        style={{ marginRight: '5px' }}
                                                    >
                                                        Завершить
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleReject(req.id)}
                                                    >
                                                        Отклонить
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center' }}>
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

export default ModeratorRequestsPage;

