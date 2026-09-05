import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // فونت نهایی Vazirmatn در فاز ۵ (پیاده‌سازی UI) اضافه و self-host می‌شه؛
        // فعلاً fallback سیستمی برای جلوگیری از FOUC در توسعه.
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;