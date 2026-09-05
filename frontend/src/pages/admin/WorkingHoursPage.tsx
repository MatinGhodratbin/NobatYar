import { useEffect, useState } from 'react';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import {
  useWorkingHours,
  useUpdateWorkingHours,
} from '@/hooks/useWorkingHours';

const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

function buildDefaultHours() {
  return dayNames.map((_, i) => ({
    day_of_week: i,
    start_time: i === 6 ? '00:00' : '09:00',
    end_time: i === 6 ? '00:00' : '17:00',
    is_day_off: i === 6,
  }));
}

export default function WorkingHoursPage() {
  const { data: business } = useMyBusiness();
  const { data: employees, isLoading } = useWorkingHours(business?.id);
  const updateHours = useUpdateWorkingHours(business?.id);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hours, setHours] = useState(buildDefaultHours());

  useEffect(() => {
    if (employees && employees.length > 0 && selectedId === null) {
      setSelectedId(employees[0].id);
    }
  }, [employees, selectedId]);

  useEffect(() => {
    if (!employees || selectedId === null) return;
    const emp = employees.find((e) => e.id === selectedId);
    if (emp && emp.working_hours.length === 7) {
      setHours(
        emp.working_hours.map((wh) => ({
          day_of_week: wh.day_of_week,
          start_time: wh.start_time ?? '09:00',
          end_time: wh.end_time ?? '17:00',
          is_day_off: wh.is_day_off,
        }))
      );
    } else {
      setHours(buildDefaultHours());
    }
  }, [selectedId, employees]);

  const handleSave = () => {
    if (selectedId === null) return;
    updateHours.mutate({ employeeId: selectedId, hours });
  };

  const toggleDayOff = (dayIndex: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === dayIndex ? { ...h, is_day_off: !h.is_day_off } : h
      )
    );
  };

  if (isLoading) return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">ساعات کاری</h1>
        <p className="text-sm text-gray-500">تنظیم ساعات کاری هر کارمند برای روزهای هفته</p>
      </div>

      {employees && employees.length > 0 && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedId(emp.id)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedId === emp.id
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {emp.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-gray-700">{dayNames[i]}</span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={h.is_day_off}
                    onChange={() => toggleDayOff(i)}
                    className="rounded"
                  />
                  استراحت
                </label>
                {!h.is_day_off && (
                  <>
                    <input
                      type="time"
                      value={h.start_time}
                      onChange={(e) =>
                        setHours((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, start_time: e.target.value } : x))
                        )
                      }
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                    <span className="text-xs text-gray-400">تا</span>
                    <input
                      type="time"
                      value={h.end_time}
                      onChange={(e) =>
                        setHours((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, end_time: e.target.value } : x))
                        )
                      }
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                  </>
                )}
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={updateHours.isPending}
              className="mt-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {updateHours.isPending ? 'در حال ذخیره...' : 'ذخیره ساعات کاری'}
            </button>
            {updateHours.isSuccess && (
              <span className="text-sm text-green-600">ذخیره شد ✓</span>
            )}
          </div>
        </>
      )}

      {employees && employees.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">هنوز کارمندی اضافه نشده است</p>
        </div>
      )}
    </div>
  );
}
