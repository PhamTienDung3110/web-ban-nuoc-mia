"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateExpense, addExpense } from './actions';

export default function ExpenseForm({ initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(e.target);
    const res = initialData
      ? await updateExpense(initialData._id, formData)
      : await addExpense(formData);
    
    if (res.error) {
      setMessage(`Lỗi: ${res.error}`);
    } else {
      if (initialData) {
        router.push('/expenses');
      } else {
        setMessage('Đã thêm khoản chi thành công!');
        e.target.reset();
      }
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: 'var(--primary-color)' }}>{initialData ? 'Sửa Khoản Chi' : 'Nhập Khoản Chi Khác'}</h2>
      {message && <div style={{ marginBottom: '1rem', color: message.startsWith('Lỗi') ? 'var(--danger)' : 'var(--success)' }}>{message}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="form-group">
          <label className="form-label">Tên khoản chi (vd: Mua bó mía, đá, ly nhựa) *</label>
          <input type="text" name="name" defaultValue={initialData?.name} className="form-control" required placeholder="Nhập tên khoản chi..." />
        </div>

        <div className="form-group">
          <label className="form-label">Số tiền (VNĐ) *</label>
          <input 
            type="text" 
            inputMode="numeric" 
            defaultValue={initialData ? new Intl.NumberFormat('vi-VN').format(initialData.amount) : ""} 
            name="amount" 
            className="form-control" 
            placeholder="VD: 50.000" 
            required 
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              e.target.value = val ? new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) : '';
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú thêm</label>
          <textarea name="description" className="form-control" rows="3" placeholder="Ghi chú thêm (nếu có)..." defaultValue={initialData?.description}></textarea>
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ alignSelf: 'flex-start', background: 'var(--danger)', color: 'white' }}>
          {loading ? 'Đang lưu...' : (initialData ? 'Cập Nhật' : 'Lưu Khoản Chi')}
        </button>
      </form>
    </div>
  );
}
