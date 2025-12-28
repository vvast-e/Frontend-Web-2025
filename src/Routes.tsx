export const ROUTES = {
    HOME: '/',
    COMETS: '/comets',
    COMET_DETAIL: '/comets/:id',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    REQUEST: '/request',
    MY_REQUESTS: '/my-requests',
    MODERATOR_REQUESTS: '/moderator/requests',
}

export type RouteKeyType = keyof typeof ROUTES

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: 'Главная',
    COMETS: 'Кометы',
    COMET_DETAIL: 'Комета',
}

