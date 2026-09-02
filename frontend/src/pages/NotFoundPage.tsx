import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-6xl font-bold text-primary-600">۴۰۴</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">صفحه مورد نظر یافت نشد</h1>
        <p className="mt-2 text-sm text-gray-500">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
