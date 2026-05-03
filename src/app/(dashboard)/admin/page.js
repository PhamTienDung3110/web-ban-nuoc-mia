import connectMongo from '@/utils/db';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import Account from '@/models/Account';
import CustomPrice from '@/models/CustomPrice';
import AdminForms from './AdminForms';
import { getSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectMongo();
  
  const products = await Product.find({ createdBy: session.userId }).lean();
  const customers = await Customer.find({ createdBy: session.userId }).lean();
  const customPrices = await CustomPrice.find({ createdBy: session.userId })
    .populate('customer', 'name')
    .populate('product', 'name')
    .lean();

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div>
      <h1 className="animate-fade-in">Quản Trị Hệ Thống</h1>
      <p className="animate-fade-in" style={{ marginBottom: '2rem' }}>Thêm sản phẩm, khách hàng, cấu hình giá và tài khoản nhân viên.</p>

      <AdminForms 
        products={products.map(p => ({...p, _id: p._id.toString()}))} 
        customers={customers.map(c => ({...c, _id: c._id.toString()}))} 
      />

      <div className="glass animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Bảng giá ưu đãi đang áp dụng</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Khách hàng / Đại lý</th>
                <th style={{ padding: '0.75rem' }}>Sản phẩm</th>
                <th style={{ padding: '0.75rem' }}>Giá ưu đãi</th>
              </tr>
            </thead>
            <tbody>
              {customPrices.map(cp => (
                <tr key={cp._id.toString()} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>{cp.customer?.name}</td>
                  <td style={{ padding: '0.75rem' }}>{cp.product?.name}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{formatMoney(cp.price)}</td>
                </tr>
              ))}
              {customPrices.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa cấu hình giá riêng.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
