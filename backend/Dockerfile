FROM php:8.3-fpm-alpine

# پکیج‌های سیستمی پایه (نیازی به کامپایل ندارن)
RUN apk add --no-cache \
        bash git curl

# کتابخانه‌های dev برای extension های PHP
RUN apk add --no-cache \
        libpng-dev libzip-dev icu-dev oniguruma-dev

# ابزارهای build موقت (برای کامپایل pecl لازمن)
RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS

# نصب extension های PHP هسته‌ای
RUN docker-php-ext-install \
        pdo pdo_mysql mbstring exif pcntl bcmath gd zip intl

# نصب و فعال‌سازی redis از طریق pecl
RUN pecl install redis \
    && docker-php-ext-enable redis

# حذف ابزارهای build که دیگه لازم نیستن
RUN apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 9000
CMD ["php-fpm"]