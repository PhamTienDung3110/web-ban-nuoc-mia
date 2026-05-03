import connectMongo from '@/utils/db';
import ExpenseRecord from '@/models/ExpenseRecord';
import ExpenseForm from '../../ExpenseForm';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function EditExpensePage({ params }) {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectMongo();
  
  const { id } = await params;
  const expense = await ExpenseRecord.findById(id).lean();
  if (!expense || expense.createdBy.toString() !== session.userId) return notFound();

  return (
    <div>
      <div className="flex" style={{ gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <Link href="/expenses" className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--border-color)', color: 'var(--text-main)' }}>
          ← Quay lại
        </Link>
        <h1 className="animate-fade-in" style={{ margin: 0 }}>Chỉnh sửa khoản chi</h1>
      </div>
      
      <ExpenseForm 
        initialData={{...expense, _id: expense._id.toString()}}
      />
    </div>
  );
}
