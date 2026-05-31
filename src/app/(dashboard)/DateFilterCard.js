"use client";
import { useRouter } from 'next/navigation';

export default function DateFilterCard({ data, initialDate }) {
  const router = useRouter();

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      router.push(`/?date=${selectedDate}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="glass card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.25rem', whiteSpace: 'nowrap' }}>Tùy Chọn</h3>
        <input 
          type="date" 
          defaultValue={initialDate || ''}
          onChange={handleDateChange}
          className="form-control"
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
        />
      </div>
      <div>
        <p className="card-title">Doanh Thu</p>
        <p className="card-value text-success">{formatMoney(data?.revenue || 0)}</p>
      </div>
      <div>
        <p className="card-title">Chi Phí</p>
        <p className="card-value text-danger">{formatMoney(data?.cost || 0)}</p>
      </div>
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <p className="card-title">Lợi Nhuận</p>
        <p className="card-value" style={{ color: (data?.profit || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formatMoney(data?.profit || 0)}
        </p>
      </div>
    </div>
  );
}
