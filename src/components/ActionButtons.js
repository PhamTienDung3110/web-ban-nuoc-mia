"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ActionButtons({ id, deleteAction, editUrl }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể hoàn tác.')) {
      startTransition(() => {
        deleteAction(id).then((res) => {
          if (res?.error) {
            alert('Lỗi xóa: ' + res.error);
          }
        });
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => router.push(editUrl)} 
        className="btn" 
        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', backgroundColor: 'var(--primary-color)', color: 'white' }}
        disabled={isPending}
      >
        Sửa
      </button>
      <button 
        onClick={handleDelete} 
        className="btn" 
        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', backgroundColor: 'var(--danger)', color: 'white' }}
        disabled={isPending}
      >
        {isPending ? 'Đang xóa...' : 'Xóa'}
      </button>
    </div>
  );
}
