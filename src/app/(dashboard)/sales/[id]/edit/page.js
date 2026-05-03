import connectMongo from '@/utils/db';
import SaleRecord from '@/models/SaleRecord';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import SalesForm from '../../SalesForm';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function EditSalePage({ params }) {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectMongo();
  
  const { id } = await params;
  const sale = await SaleRecord.findById(id).lean();
  if (!sale || sale.createdBy.toString() !== session.userId) return notFound();

  const products = await Product.find({ createdBy: session.userId }).lean();
  const customers = await Customer.find({ createdBy: session.userId }).lean();

  return (
    <div>
      <div className="flex" style={{ gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <Link href="/sales" className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--border-color)', color: 'var(--text-main)' }}>
          ← Quay lại
        </Link>
        <h1 className="animate-fade-in" style={{ margin: 0 }}>Chỉnh sửa giao dịch</h1>
      </div>
      
      <SalesForm 
        products={products.map(p => ({...p, _id: p._id.toString()}))} 
        customers={customers.map(c => ({...c, _id: c._id.toString()}))} 
        initialData={{...sale, _id: sale._id.toString(), product: sale.product.toString(), customer: sale.customer?.toString()}}
      />
    </div>
  );
}
