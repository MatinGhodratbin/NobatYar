import { useState } from 'react';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  type AdminService,
} from '@/hooks/useAdminBusiness';

const emptyForm = { name: '', description: '', duration_minutes: 30, price: 0, is_active: true };

export default function ServicesPage() {
  const { data: business } = useMyBusiness();
  const { data: services, isLoading } = useAdminServices(business?.id);
  const createService = useCreateService(business?.id);
  const updateService = useUpdateService(business?.id);
  const deleteService = useDeleteService(business?.id);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (s: AdminService) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description ?? '',
      duration_minutes: s.duration_minutes,
      price: s.price,
      is_active: s.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      updateService.mutate(
        { serviceId: editingId, ...form },
        { onSuccess: () => { setShowForm(false); setEditingId(null); } }
      );
    } else {
      createService.mutate(form, { onSuccess: () => setShowForm(false) });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از غیرفعال کردن این خدمت اطمینان دارید؟')) {
      deleteService.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">مدیریت سرویس‌ها</h1>
          <p className="text-sm text-gray-500">افزودن، ویرایش و غیرفعال کردن سرویس‌های کسب‌وکار</p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + سرویس جدید
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-bold text-gray-700">
            {editingId ? 'ویرایش سرویس' : 'سرویس جدید'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="نام سرویس"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="مدت (دقیقه)"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="قیمت (تومان)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              placeholder="توضیحات (اختیاری)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded"
              />
              فعال
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={createService.isPending || updateService.isPending}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {editingId ? 'ذخیره تغییرات' : 'افزودن'}
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

      {!isLoading && (!services || services.length === 0) && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">هنوز سرویسی تعریف نشده است</p>
        </div>
      )}

      {services && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border bg-white p-4 space-y-2 ${
                s.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.is_active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
              {s.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{s.duration_minutes} دقیقه</span>
                <span>{s.price.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => startEdit(s)}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  ویرایش
                </button>
                {s.is_active && (
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    غیرفعال
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
