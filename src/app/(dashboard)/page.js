import connectMongo from '@/utils/db';
import mongoose from 'mongoose';
import SaleRecord from '@/models/SaleRecord';
import ExpenseRecord from '@/models/ExpenseRecord';
import { getSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId) {
  await connectMongo();
  
  const now = new Date();
  
  // Today start/end
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Month start/end
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  // Year start/end
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(startOfYear);
  endOfYear.setFullYear(endOfYear.getFullYear() + 1);

  const getStats = async (start, end) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    const sales = await SaleRecord.aggregate([
      { $match: { date: { $gte: start, $lt: end }, createdBy: objectId } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const expenses = await ExpenseRecord.aggregate([
      { $match: { date: { $gte: start, $lt: end }, createdBy: objectId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenue = sales[0]?.total || 0;
    const cost = expenses[0]?.total || 0;
    const profit = revenue - cost;
    return { revenue, cost, profit };
  };

  const [today, month, year] = await Promise.all([
    getStats(startOfDay, endOfDay),
    getStats(startOfMonth, endOfMonth),
    getStats(startOfYear, endOfYear)
  ]);

  return { today, month, year };
}

function StatCard({ title, data }) {
  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="glass card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.25rem' }}>{title}</h3>
      <div>
        <p className="card-title">Doanh Thu</p>
        <p className="card-value text-success">{formatMoney(data.revenue)}</p>
      </div>
      <div>
        <p className="card-title">Chi Phí</p>
        <p className="card-value text-danger">{formatMoney(data.cost)}</p>
      </div>
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <p className="card-title">Lợi Nhuận</p>
        <p className="card-value" style={{ color: data.profit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formatMoney(data.profit)}
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const data = await getDashboardData(session.userId);

  return (
    <div>
      <h1 className="animate-fade-in">Tổng Quan Hoạt Động</h1>
      <p className="animate-fade-in" style={{ marginBottom: '2rem' }}>Thống kê doanh thu, chi phí và lợi nhuận bán nước mía.</p>

      <div className="grid-cards">
        <StatCard title="Hôm Nay" data={data.today} />
        <StatCard title="Tháng Này" data={data.month} />
        <StatCard title="Năm Nay" data={data.year} />
      </div>
    </div>
  );
}
