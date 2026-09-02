import { useState } from 'react';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import {
  useAdminEmployees,
  useAdminServices,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  type AdminEmployee,
} from '@/hooks/useAdminBusiness';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

const emptyForm = { name: '', email: '', phone: '', position: '', service_ids: [] as number[] };

export default function EmployeesPage() {
  const { data: business } = useMyBusiness();
  const { data: employees, isLoading } = useAdminEmployees(business?.id);
  const { data: services } = useAdminServices(business?.id);
  const createEmployee = useCreateEmployee(business?.id);
  const updateEmployee = useUpdateEmployee(business?.id);
  const deleteEmployee = useDeleteEmployee(business?.id);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (emp: AdminEmployee) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone ?? '',
      position: emp.position ?? '',
      service_ids: [],
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || (!editingId && !form.email.trim())) return;
    if (editingId) {
      updateEmployee.mutate(
        {
          employeeId: editingId,
          name: form.name,
          phone: form.phone || undefined,
          position: form.position || undefined,
          service_ids: form.service_ids.length > 0 ? form.service_ids : undefined,
        },
        { onSuccess: () => { setShowForm(false); setEditingId(null); } }
      );
    } else {
      createEmployee.mutate(
        {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          position: form.position || undefined,
          service_ids: form.service_ids.length > 0 ? form.service_ids : undefined,
        },
        { onSuccess: () => { setShowForm(false); setForm(emptyForm); } }
      );
    }
  };

  const handleDelete = () => {
    if (deleteTarget === null) return;
    deleteEmployee.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) });
  };

  const toggleServiceId = (id: number) => {
    setForm((prev) => ({
      ...prev,
      service_ids: prev.service_ids.includes(id)
        ? prev.service_ids.filter((s) => s !== id)
        : [...prev.service_ids, id],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">مدیریت کارمندان</h1>
          <p className="text-sm text-gray-500">افزودن و مدیریت دسترسی کارمندان کسب‌وکار</p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + کارمند جدید
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-bold text-gray-700">
            {editingId ? 'ویرایش کارمند' : 'کارمند جدید'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="نام کامل"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            {!editingId && (
              <input
                type="email"
                placeholder="ایمیل"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            )}
            <input
              placeholder="شماره تماس (اختیاری)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              placeholder="سمت (اختیاری)"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          {services && services.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">سرویس‌های مجاز:</p>
              <div className="flex flex-wrap gap-2">
                {services.filter((s) => s.is_active).map((s) => (
                  <label
                    key={s.id}
                    className={`cursor-pointer rounded-lg border px-3 py-1 text-xs transition ${
                      form.service_ids.includes(s.id)
                        ? 'border-primary-300 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.service_ids.includes(s.id)}
                      onChange={() => toggleServiceId(s.id)}
                      className="sr-only"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={createEmployee.isPending || updateEmployee.isPending}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {editingId ? 'ذخیره تغییرات' : createEmployee.isPending ? 'در حال افزودن...' : 'افزودن'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {isLoading && <div className="text-sm text-gray-400">در حال بارگذاری...</div>}

      {!isLoading && (!employees || employees.length === 0) && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">هنوز کارمندی اضافه نشده است</p>
        </div>
      )}

      {employees && employees.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-right">نام</th>
                <th className="p-3 text-right">ایمیل</th>
                <th className="p-3 text-right">سمت</th>
                <th className="p-3 text-right">سرویس‌ها</th>
                <th className="p-3 text-right">وضعیت</th>
                <th className="p-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-t border-gray-50">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3 text-gray-500">{e.email}</td>
                  <td className="p-3 text-gray-500">{e.position ?? '—'}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {e.services?.map((s) => (
                        <span key={s} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {e.is_active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {e.is_active && (
                        <>
                          <button
                            onClick={() => startEdit(e)}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => setDeleteTarget(e.id)}
                            className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            غیرفعال
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        isOpen={deleteTarget !== null}
        title="غیرفعال کردن کارمند"
        message="آیا از غیرفعال کردن دسترسی این کارمند اطمینان دارید؟"
        confirmLabel="غیرفعال کردن"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteEmployee.isPending}
      />
    </div>
  );
}
