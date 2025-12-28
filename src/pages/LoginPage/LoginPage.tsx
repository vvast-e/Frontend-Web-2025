import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { loginUserAsync } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const error = useSelector((state: RootState) => state.user.error);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    // Перенаправление при успешной авторизации
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.COMETS);
        }
    }, [isAuthenticated, navigate]);

    // Обработчик события изменения полей ввода
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработчик события нажатия на кнопку "Войти"
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.email && formData.password) {
            await dispatch(loginUserAsync(formData));
        }
    };

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}> 
                <Container style={{ maxWidth: '400px', marginTop: '150px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Рады снова Вас видеть!</h2>
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
                        <Button variant="primary" type="submit" style={{ width: '100%' }}>
                            Войти
                        </Button>
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <a href={ROUTES.REGISTER}>Нет аккаунта? Зарегистрироваться</a>
                        </div>
                    </Form>
                </Container>
            </Container>
    );
};

export default LoginPage;

