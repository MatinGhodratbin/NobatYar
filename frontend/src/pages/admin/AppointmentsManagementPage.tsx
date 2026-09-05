import { useState } from 'react';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import { useAdminAppointments, useUpdateAppointmentStatus, useUpdateAppointmentNotes } from '@/hooks/useAdminBusiness';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';

const statusOptions = ['pending', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled'];

function toRial(n: number) {
  return n.toLocaleString('fa-IR');
}

export default function AppointmentsManagementPage() {
  const { data: business } = useMyBusiness();
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminAppointments(business?.id, {
    status: statusFilter || undefined,
    date: dateFilter || undefined,
    search: search || undefined,
    page,
  });
  const updateStatus = useUpdateAppointmentStatus(business?.id);
  const updateNotes = useUpdateAppointmentNotes(business?.id);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const appointments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">مدیریت نوبت‌ها</h1>
        <p className="text-sm text-gray-500">مشاهده، تایید و مدیریت رزروهای کسب‌وکار شما</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="جستجوی مشتری یا کد..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">همه وضعیت‌ها</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div className="text-sm text-gray-400">در حال بارگذاری...</div>}

      {!isLoading && appointments.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">هیچ نوبتی مطابق فیلترهای شما ثبت نشده است</p>
        </div>
      )}

      {appointments.length > 0 && (
        <>
          {/* دسکتاپ: جدول */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3 text-right">کد</th>
                  <th className="p-3 text-right">مشتری</th>
                  <th className="p-3 text-right">سرویس</th>
                  <th className="p-3 text-right">پرسنل</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">ساعت</th>
                  <th className="p-3 text-right">مبلغ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">یادداشت</th>
                  <th className="p-3 text-right">تغییر وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t border-gray-50">
                    <td className="p-3 font-mono text-xs">{a.code}</td>
                    <td className="p-3">{a.customer?.name ?? '—'}</td>
                    <td className="p-3">{a.service.name}</td>
                    <td className="p-3">{a.employee.name}</td>
                    <td className="p-3">{a.appointment_date}</td>
                    <td className="p-3">{a.start_time}</td>
                    <td className="p-3">{toRial(a.price)} تومان</td>
                    <td className="p-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="p-3">
                      {editingNotesId === a.id ? (
                        <div className="flex gap-1">
                          <input
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            className="w-32 rounded border border-gray-200 px-2 py-1 text-xs"
                            placeholder="یادداشت..."
                          />
                          <button
                            onClick={() => {
                              updateNotes.mutate({ appointmentId: a.id, notes: notesValue });
                              setEditingNotesId(null);
                            }}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            ذخیره
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingNotesId(a.id); setNotesValue(a.notes ?? ''); }}
                          className="text-xs text-gray-500 hover:text-primary-600 max-w-[120px] truncate block"
                          title={a.notes || 'افزودن یادداشت'}
                        >
                          {a.notes || '+ یادداشت'}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={a.status}
                        onChange={(e) =>
                          updateStatus.mutate({ appointmentId: a.id, status: e.target.value })
                        }
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* موبایل: کارتی */}
          <div className="lg:hidden space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">{a.code}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-2 text-sm font-medium">{a.customer?.name ?? '—'}</p>
                <p className="text-sm text-gray-700">{a.service.name}</p>
                <p className="text-xs text-gray-400">{a.employee.name} · {a.appointment_date} · {a.start_time}</p>
                <p className="mt-1 text-sm font-semibold text-primary-600">{toRial(a.price)} تومان</p>

                {a.notes && (
                  <p className="mt-1 text-xs text-gray-500 bg-gray-50 rounded p-2">{a.notes}</p>
                )}

                <select
                  value={a.status}
                  onChange={(e) => updateStatus.mutate({ appointmentId: a.id, status: e.target.value })}
                  className="mt-3 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
