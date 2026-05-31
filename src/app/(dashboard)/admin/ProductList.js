"use client";
import { useState } from 'react';
import { updateProduct, deleteProduct } from './actions';
import ActionButtons from '@/components/ActionButtons';

export default function ProductList({ products }) {
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val);

  const handleEdit = (id) => {
    setEditingId(id);
    setMsg('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setMsg('');
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const formData = new FormData(e.target);
    formData.append('id', id);
    const res = await updateProduct(formData);
    if (res.error) {
      setMsg(`Lỗi: ${res.error}`);
    } else {
      setEditingId(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này? (Các giao dịch cũ vẫn sẽ giữ tên sản phẩm này)')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="glass animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Danh sách sản phẩm</h3>
      {msg && <div style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{msg}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem' }}>Tên sản phẩm</th>
              <th style={{ padding: '0.75rem' }}>Giá mặc định</th>
              <th style={{ padding: '0.75rem' }}>Đơn vị</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {editingId === product._id ? (
                  <td colSpan="4" style={{ padding: '0.75rem' }}>
                    <form onSubmit={(e) => handleUpdate(e, product._id)} className="flex gap-4 items-center">
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={product.name} 
                        className="form-control" 
                        required 
                        style={{ flex: 2 }}
                      />
                      <input 
                        type="text" 
                        inputMode="numeric"
                        name="defaultPrice" 
                        defaultValue={formatMoney(product.defaultPrice)}
                        className="form-control" 
                        required 
                        style={{ flex: 1 }}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          e.target.value = val ? new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) : '';
                        }}
                      />
                      <input 
                        type="text" 
                        name="unit" 
                        defaultValue={product.unit} 
                        className="form-control" 
                        required 
                        style={{ flex: 1 }}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={loading}>Lưu</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Huỷ</button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td data-label="Tên sản phẩm" style={{ padding: '0.75rem' }}>{product.name}</td>
                    <td data-label="Giá mặc định" style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.defaultPrice)}
                    </td>
                    <td data-label="Đơn vị" style={{ padding: '0.75rem' }}>{product.unit}</td>
                    <td data-label="Thao tác" style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(product._id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Sửa</button>
                        <button onClick={() => handleDelete(product._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Xoá</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
