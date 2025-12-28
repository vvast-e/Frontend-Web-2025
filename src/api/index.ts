import { Api } from './generated/Api';
import { dest_api } from '../config/target_config';

export const api = new Api({
    baseURL: dest_api,
    withCredentials: true, // Включаем отправку cookies для сессий
});

