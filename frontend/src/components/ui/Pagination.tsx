interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.last_page <= 1) return null;

  const pages: (number | '...')[] = [];
  const { current_page, last_page } = meta;

  if (last_page <= 5) {
    for (let i = 1; i <= last_page; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current_page > 3) pages.push('...');
    for (
      let i = Math.max(2, current_page - 1);
      i <= Math.min(last_page - 1, current_page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current_page < last_page - 2) pages.push('...');
    pages.push(last_page);
  }

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <span className="text-xs text-gray-500">
        صفحه {current_page} از {last_page} — مجموع {meta.total} ردیف
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          قبلی
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] rounded-lg px-2 py-1 text-xs font-medium ${
                p === current_page
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= last_page}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
