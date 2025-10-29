export const ROUTES = {
    HOME: '/',
    COMETS: '/comets',
    COMET_DETAIL: '/comets/:id',
}

export type RouteKeyType = keyof typeof ROUTES

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: 'Главная',
    COMETS: 'Кометы',
    COMET_DETAIL: 'Комета',
}

