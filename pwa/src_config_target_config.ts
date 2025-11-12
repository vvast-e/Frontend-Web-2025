/**
 * Конфигурация для PWA (локальная разработка)
 */

// Для веб-режима используем прокси
export const dest_api = "/api"
export const dest_img = "/img-proxy"

// Basename для роутинга - пустая строка для локальной разработки
export const dest_root = ''

// Функция для получения пути к изображению по умолчанию
export const getDefaultImagePath = () => '/default-comet.png'

