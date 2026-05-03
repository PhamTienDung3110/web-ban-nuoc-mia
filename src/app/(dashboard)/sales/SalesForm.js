"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSale, addSale } from './actions';

export default function SalesForm({ products, customers, initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(e.target);
    const res = initialData 
      ? await updateSale(initialData._id, formData)
      : await addSale(formData);
    
    if (res.error) {
      setMessage(`Lỗi: ${res.error}`);
    } else {
      if (initialData) {
        router.push('/sales');
      } else {
        setMessage('Đã thêm giao dịch bán thành công!');
        e.target.reset();
      }
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: 'var(--primary-color)' }}>{initialData ? 'Sửa Giao Dịch Bán Hàng' : 'Nhập Hàng Đã Bán'}</h2>
      {message && <div style={{ marginBottom: '1rem', color: message.startsWith('Lỗi') ? 'var(--danger)' : 'var(--success)' }}>{message}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Sản phẩm *</label>
            <select name="product" className="form-control" defaultValue={initialData?.product?.toString()} required>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} (Giá gốc: {p.defaultPrice.toLocaleString()}đ/{p.unit})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Số lượng *</label>
          <input 
            type="text" 
            inputMode="numeric" 
            name="quantity" 
            className="form-control" 
            defaultValue={initialData ? new Intl.NumberFormat('vi-VN').format(initialData.quantity) : "1"} 
            required 
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              e.target.value = val ? new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) : '';
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? 'Đang lưu...' : (initialData ? 'Cập Nhật' : 'Lưu Giao Dịch')}
        </button>
      </form>
    </div>
  );
}
