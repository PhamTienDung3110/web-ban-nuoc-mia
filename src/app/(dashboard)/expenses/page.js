import connectMongo from '@/utils/db';
import ExpenseRecord from '@/models/ExpenseRecord';
import Account from '@/models/Account';
import ExpenseForm from './ExpenseForm';
import ActionButtons from '@/components/ActionButtons';
import { deleteExpense } from './actions';
import { getSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectMongo();
  
  const recentExpenses = await ExpenseRecord.find({ createdBy: session.userId })
    .populate('createdBy', 'name')
    .sort({ date: -1 })
    .limit(20)
    .lean();

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

  return (
    <div>
      <h1 className="animate-fade-in">Quản Lý Chi Phí</h1>
      
      <ExpenseForm />

      <div className="glass animate-fade-in" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Chi phí gần đây</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Thời gian</th>
                <th style={{ padding: '0.75rem' }}>Khoản chi</th>
                <th style={{ padding: '0.75rem' }}>Ghi chú</th>
                <th style={{ padding: '0.75rem' }}>Số tiền</th>
                <th style={{ padding: '0.75rem' }}>Người nhập</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map(expense => (
                <tr key={expense._id.toString()} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td data-label="Thời gian" style={{ padding: '0.75rem' }}>{formatDate(expense.date)}</td>
                  <td data-label="Khoản chi" style={{ padding: '0.75rem' }}>{expense.name}</td>
                  <td data-label="Ghi chú" style={{ padding: '0.75rem' }}>{expense.description || '-'}</td>
                  <td data-label="Số tiền" style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--danger)' }}>{formatMoney(expense.amount)}</td>
                  <td data-label="Người nhập" style={{ padding: '0.75rem' }}>{expense.createdBy?.name}</td>
                  <td data-label="Thao tác" style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <ActionButtons 
                      id={expense._id.toString()} 
                      deleteAction={deleteExpense} 
                      editUrl={`/expenses/${expense._id.toString()}/edit`} 
                    />
                  </td>
                </tr>
              ))}
              {recentExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có khoản chi nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
