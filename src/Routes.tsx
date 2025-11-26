export const ROUTES = {
    HOME: '/',
    COMETS: '/comets',
    COMET_DETAIL: '/comets/:id',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    COMET_REQUESTS: '/comet-requests',
    TRAJECTORY_CALCULATION: '/trajectory-calculation/:id',
}

export type RouteKeyType = keyof typeof ROUTES

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: 'Главная',
    COMETS: 'Кометы',
    COMET_DETAIL: 'Комета',
    LOGIN: 'Вход',
    REGISTER: 'Регистрация',
    PROFILE: 'Профиль',
    COMET_REQUESTS: 'Заявки на кометы',
    TRAJECTORY_CALCULATION: 'Расчет траектории',
}

