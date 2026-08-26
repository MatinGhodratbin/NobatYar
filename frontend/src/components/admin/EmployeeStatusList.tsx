import { useEmployeeList } from '@/hooks/useEmployeeStatus';

const statusLabels: Record<string, string> = {
  working: 'در حال کار',
  resting: 'استراحت',
  off: 'غیرفعال',
};

const statusDotColor: Record<string, string> = {
  working: 'bg-green-500',
  resting: 'bg-amber-500',
  off: 'bg-gray-300',
};

export function EmployeeStatusList({ businessId }: { businessId?: number }) {
  const { employees, isLoading } = useEmployeeList(businessId);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <h2 className="mb-3 text-sm font-bold text-gray-700">وضعیت امروز پرسنل</h2>

      {isLoading && <p className="text-sm text-gray-400">در حال بارگذاری...</p>}

      {!isLoading && employees.length === 0 && (
        <p className="text-sm text-gray-400">هنوز پرسنلی ثبت نشده است.</p>
      )}

      <div className="space-y-2">
        {employees.map((e) => (
          <div key={e.id} className="flex items-center justify-between text-sm">
            <span>{e.name}</span>
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${statusDotColor[e.status]}`} />
              <span className="text-gray-500 text-xs">{statusLabels[e.status]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}