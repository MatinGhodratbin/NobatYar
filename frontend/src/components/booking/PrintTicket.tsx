export interface TicketData {
  code: string;
  service: string;
  employee: string;
  business: string;
  date: string;
  time: string;
  price: number;
  notes?: string;
}

export function printTicket(ticket: TicketData) {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>بلیط نوبت ${ticket.code}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; text-align: center; }
        .ticket { border: 2px dashed #7c3aed; border-radius: 12px; padding: 24px; max-width: 320px; margin: 0 auto; }
        .header { font-size: 18px; font-weight: bold; color: #7c3aed; margin-bottom: 8px; }
        .code { font-size: 24px; font-weight: bold; color: #1f2937; margin: 12px 0; font-family: monospace; letter-spacing: 2px; }
        .divider { border-top: 1px dashed #d1d5db; margin: 12px 0; }
        .row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
        .label { color: #6b7280; }
        .value { font-weight: 600; color: #1f2937; }
        .price { font-size: 16px; font-weight: bold; color: #7c3aed; margin-top: 8px; }
        .footer { font-size: 11px; color: #9ca3af; margin-top: 16px; }
        @media print { body { padding: 10px; } }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">${ticket.business}</div>
        <div class="code">${ticket.code}</div>
        <div class="divider"></div>
        <div class="row"><span class="label">سرویس:</span><span class="value">${ticket.service}</span></div>
        <div class="row"><span class="label">پرسنل:</span><span class="value">${ticket.employee}</span></div>
        <div class="row"><span class="label">تاریخ:</span><span class="value">${ticket.date}</span></div>
        <div class="row"><span class="label">ساعت:</span><span class="value">${ticket.time}</span></div>
        <div class="divider"></div>
        <div class="price">${ticket.price.toLocaleString('fa-IR')} تومان</div>
        ${ticket.notes ? `<div style="margin-top:8px;font-size:12px;color:#6b7280;">یادداشت: ${ticket.notes}</div>` : ''}
        <div class="footer">نوبت‌یار — سیستم مدیریت نوبت</div>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
