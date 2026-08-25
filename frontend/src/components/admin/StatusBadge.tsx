const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  in_queue: 'bg-purple-50 text-purple-700',
  in_progress: 'bg-indigo-50 text-indigo-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'در انتظار',
  confirmed: 'تایید شده',
  in_queue: 'در صف',
  in_progress: 'در حال انجام',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? 'bg-gray-50 text-gray-600'}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}