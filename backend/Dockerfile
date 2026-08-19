FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
        bash git curl \
        libpng-dev libzip-dev icu-dev oniguruma-dev \
    && docker-php-ext-install \
        pdo pdo_mysql mbstring exif pcntl bcmath gd zip intl \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 9000
CMD ["php-fpm"]