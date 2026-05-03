import connectMongo from '@/utils/db';
import SaleRecord from '@/models/SaleRecord';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import Account from '@/models/Account';
import SalesForm from './SalesForm';
import ActionButtons from '@/components/ActionButtons';
import { deleteSale } from './actions';
import { getSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectMongo();
  
  const products = await Product.find({ createdBy: session.userId }).lean();
  const customers = await Customer.find({ createdBy: session.userId }).lean();
  
  const recentSales = await SaleRecord.find({ createdBy: session.userId })
    .populate('product', 'name unit')
    .populate('customer', 'name')
    .populate('createdBy', 'name')
    .sort({ date: -1 })
    .limit(20)
    .lean();

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

  return (
    <div>
      <h1 className="animate-fade-in">Quản Lý Bán Hàng</h1>
      
      {/* Ensure IDs are serialized to string if passing to client component */}
      <SalesForm 
        products={products.map(p => ({...p, _id: p._id.toString()}))} 
        customers={customers.map(c => ({...c, _id: c._id.toString()}))} 
      />

      <div className="glass animate-fade-in" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Giao dịch gần đây</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Thời gian</th>
                <th style={{ padding: '0.75rem' }}>Sản phẩm</th>
                <th style={{ padding: '0.75rem' }}>Số lượng</th>
                <th style={{ padding: '0.75rem' }}>Đơn giá</th>
                <th style={{ padding: '0.75rem' }}>Thành tiền</th>
                <th style={{ padding: '0.75rem' }}>Người nhập</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map(sale => (
                <tr key={sale._id.toString()} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td data-label="Thời gian" style={{ padding: '0.75rem' }}>{formatDate(sale.date)}</td>
                  <td data-label="Sản phẩm" style={{ padding: '0.75rem' }}>{sale.product?.name}</td>
                  <td data-label="Số lượng" style={{ padding: '0.75rem' }}>{sale.quantity} {sale.product?.unit}</td>
                  <td data-label="Đơn giá" style={{ padding: '0.75rem' }}>{formatMoney(sale.unitPrice)}</td>
                  <td data-label="Thành tiền" style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--success)' }}>{formatMoney(sale.totalPrice)}</td>
                  <td data-label="Người nhập" style={{ padding: '0.75rem' }}>{sale.createdBy?.name}</td>
                  <td data-label="Thao tác" style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <ActionButtons 
                      id={sale._id.toString()} 
                      deleteAction={deleteSale} 
                      editUrl={`/sales/${sale._id.toString()}/edit`} 
                    />
                  </td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có giao dịch nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
