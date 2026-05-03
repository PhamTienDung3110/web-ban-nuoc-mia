"use client";
import { useState } from 'react';
import { addProduct, addCustomer, addCustomPrice } from './actions';

function FormWrapper({ title, action, children }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const formData = new FormData(e.target);
    const res = await action(formData);
    if (res.error) setMsg(`Lỗi: ${res.error}`);
    else {
      setMsg('Thành công!');
      e.target.reset();
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{title}</h3>
      {msg && <div style={{ marginBottom: '1rem', color: msg.startsWith('Lỗi') ? 'var(--danger)' : 'var(--success)' }}>{msg}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {children}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? 'Đang lưu...' : 'Thêm'}
        </button>
      </form>
    </div>
  );
}

export default function AdminForms({ products, customers }) {
  return (
    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      <FormWrapper title="Thêm Sản Phẩm Mới" action={addProduct}>
        <div className="form-group">
          <label className="form-label">Tên sản phẩm</label>
          <input type="text" name="name" className="form-control" required />
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Giá mặc định</label>
            <input 
            type="text" 
            inputMode="numeric"
            name="defaultPrice" 
            className="form-control" 
            placeholder="VD: 15.000" 
            required 
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              e.target.value = val ? new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) : '';
            }}
          />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Đơn vị (Ly, Chai..)</label>
            <input type="text" name="unit" className="form-control" defaultValue="Ly" required />
          </div>
        </div>
      </FormWrapper>

      <FormWrapper title="Thêm Khách Hàng (Đại lý)" action={addCustomer}>
        <div className="form-group">
          <label className="form-label">Tên khách / Đại lý</label>
          <input type="text" name="name" className="form-control" required />
        </div>
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input type="text" name="phone" className="form-control" />
        </div>
      </FormWrapper>

      <FormWrapper title="Cài Giá Riêng Cho Khách" action={addCustomPrice}>
        <div className="form-group">
          <label className="form-label">Khách hàng</label>
          <select name="customer" className="form-control" required>
            <option value="">-- Chọn khách --</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Sản phẩm</label>
          <select name="product" className="form-control" required>
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Giá ưu đãi</label>
          <input 
            type="text" 
            inputMode="numeric"
            name="price" 
            className="form-control" 
            placeholder="VD: 12.000" 
            required 
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              e.target.value = val ? new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) : '';
            }}
          />
        </div>
      </FormWrapper>
    </div>
  );
}
