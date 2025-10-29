import { Comet } from '../types'

export const COMETS_MOCK: Comet[] = [
    {
        id: 1,
        name: 'Комета Галлея',
        description: 'Периодическая комета из семейства Юпитера. Возвращается к Земле каждые 75-76 лет. Последнее появление было в 1986 году, следующее ожидается в 2061 году.',
        price: 50000,
        image_key: 'halley.jpg',
        image_url: '/default-comet.png',
        k_x: '0.587',
        k_y: '0.349',
        k_z: '-0.124',
    },
    {
        id: 2,
        name: 'Комета Hale-Bopp',
        description: 'Одна из самых ярких комет XX века. Была видна невооруженным глазом рекордные 18 месяцев. Период обращения составляет около 2533 лет.',
        price: 75000,
        image_key: 'hale-bopp.jpg',
        image_url: '/default-comet.png',
        k_x: '0.714',
        k_y: '-0.412',
        k_z: '0.568',
    },
    {
        id: 3,
        name: 'NEOWISE',
        description: 'Комета C/2020 F3 (NEOWISE), открытая космическим телескопом NEOWISE. Была видна невооруженным глазом в июле 2020 года.',
        price: 60000,
        image_key: 'neowise.jpg',
        image_url: '/default-comet.png',
        k_x: '-0.123',
        k_y: '0.456',
        k_z: '0.789',
    },
    {
        id: 4,
        name: '67P/Чурюмова-Герасименко',
        description: 'Короткопериодическая комета с периодом обращения 6.45 лет. В 2014 году на неё совершил посадку космический аппарат "Розетта".',
        price: 80000,
        image_key: '67p.jpg',
        image_url: '/default-comet.png',
        k_x: '0.234',
        k_y: '0.567',
        k_z: '-0.345',
    },
]

