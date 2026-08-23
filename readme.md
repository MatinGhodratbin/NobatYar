# نوبت‌یار (NobatYar)

پلتفرم نوبت‌دهی و مدیریت صف real-time برای کسب‌وکارهای محلی (آرایشگاه، کلینیک، سالن زیبایی و...).

این پروژه به‌عنوان یک **نمونه‌کار (portfolio project)** با کیفیت production توسعه داده می‌شود و به‌صورت فاز‌به‌فاز روی گیت‌هاب پیش می‌رود.

## ویژگی‌های اصلی (در حال توسعه)

- رزرو نوبت آنلاین با انتخاب خدمت و متخصص
- انتخاب تاریخ و زمان با نمایش بازه‌های آزاد
- صف زنده مشتری با تخمین زمان انتظار (real-time)
- داشبورد مدیریتی برای صاحب کسب‌وکار
- مدیریت کامل نوبت‌ها برای ادمین

## استک فنی

| بخش | فناوری |
|---|---|
| Backend | Laravel 11 (PHP 8.3+) |
| دیتابیس | MySQL 8 |
| کش/صف | Redis |
| Auth | Laravel Sanctum (SPA) |
| Real-time | Laravel Reverb + Echo |
| Frontend | React 18 + TypeScript + Vite |
| Server State | TanStack Query |
| Client State | Zustand |
| فرم | React Hook Form + Zod |
| استایل | TailwindCSS (RTL) |
| نمودار | Recharts |
| تست بک‌اند | Pest |
| تست فرانت | Jest + React Testing Library |
| زیرساخت | Docker Compose |

## پیش‌نیازها

- Docker و Docker Compose نصب باشد

## راه‌اندازی محیط توسعه

### مراحل نصب

```bash
# ۱. کلون پروژه
git clone <URL_ریپو>
cd nobatyar

# ۲. ساخت ایمیج‌ها
docker compose build

# ۳. بالا آوردن دیتابیس و ردیس
docker compose up -d mysql redis

# ۴. نصب وابستگی‌های بک‌اند
docker compose run --rm app composer install

# ۵. تنظیم فایل env بک‌اند
cp backend/.env.example backend/.env
docker compose run --rm app php artisan key:generate

# ۶. اجرای مایگریشن‌ها
docker compose run --rm app php artisan migrate

# ۷. نصب وابستگی‌های فرانت‌اند
docker compose run --rm frontend npm install

# ۸. تنظیم فایل env فرانت‌اند
cp frontend/.env.example frontend/.env

# ۹. بالا آوردن همه سرویس‌ها
docker compose up -d
```

### آدرس‌های سرویس‌ها بعد از بالا آمدن

| سرویس | آدرس |
|---|---|
| بک‌اند (API) | http://localhost:8080 |
| فرانت‌اند (Vite dev server) | http://localhost:5173 |
| MySQL | localhost:3306 |
| Redis | localhost:6379 |

### دستورات مفید روزمره

```bash
# مشاهده وضعیت سرویس‌ها
docker compose ps

# مشاهده لاگ یک سرویس خاص
docker compose logs -f app
docker compose logs -f frontend

# اجرای دستور artisan
docker compose run --rm app php artisan <command>

# اجرای دستور npm
docker compose run --rm frontend npm <command>

# متوقف کردن همه سرویس‌ها
docker compose down

# متوقف کردن و پاک کردن volume دیتابیس (ریست کامل)
docker compose down -v
```

## ساختار پروژه

```
nobatyar/
├── backend/          # اپلیکیشن Laravel (API)
├── frontend/          # اپلیکیشن React (SPA)
├── docker/
│   └── nginx/         # کانفیگ nginx
├── docker-compose.yml
└── README.md
```