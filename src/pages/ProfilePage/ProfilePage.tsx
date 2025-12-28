import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getProfileAsync, updateProfileAsync } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const [formData, setFormData] = useState({ email: '', username: '', password: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user.isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }
        dispatch(getProfileAsync());
    }, [dispatch, navigate, user.isAuthenticated]);

    useEffect(() => {
        if (user.email) {
            setFormData({
                email: user.email,
                username: user.username,
                password: '',
                newPassword: '',
            });
        }
    }, [user.email, user.username]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const updateData: any = {
                email: formData.email,
                username: formData.username,
            };
            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }
            await dispatch(updateProfileAsync(updateData)).unwrap();
            setSuccess(true);
            if (formData.newPassword) {
                setFormData({ ...formData, password: '', newPassword: '' });
            }
        } catch (err: any) {
            setError(err || 'Ошибка при обновлении профиля');
        } finally {
            setLoading(false);
        }
    };

    if (!user.isAuthenticated) {
        return null;
    }

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
                <Container style={{ maxWidth: '600px', marginTop: '50px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Личный кабинет</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Профиль успешно обновлен</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" style={{ marginBottom: '15px' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="username" style={{ marginBottom: '15px' }}>
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="password" style={{ marginBottom: '15px' }}>
                            <Form.Label>Текущий пароль (для смены пароля)</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Оставьте пустым, если не меняете пароль"
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword" style={{ marginBottom: '20px' }}>
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Введите новый пароль"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : 'Сохранить изменения'}
                        </Button>
                    </Form>
                </Container>
            </Container>
    );
};

export default ProfilePage;

