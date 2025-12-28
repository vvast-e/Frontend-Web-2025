import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { ROUTES } from '../../Routes';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.users.usersRegister({
                username: formData.username || formData.email,
                email: formData.email,
                password: formData.password,
            });
            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 
                               err.response?.data?.message || 
                               (typeof err.response?.data === 'object' ? JSON.stringify(err.response.data) : 'Ошибка при регистрации');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
                <Container style={{ maxWidth: '400px', marginTop: '150px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Регистрация</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" style={{ marginBottom: '15px' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Введите email"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="username" style={{ marginBottom: '15px' }}>
                            <Form.Label>Имя пользователя (необязательно)</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Введите имя пользователя"
                            />
                        </Form.Group>
                        <Form.Group controlId="password" style={{ marginBottom: '20px' }}>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Введите пароль"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <a href={ROUTES.LOGIN}>Уже есть аккаунт? Войти</a>
                        </div>
                    </Form>
                </Container>
            </Container>
    );
};

export default RegisterPage;

