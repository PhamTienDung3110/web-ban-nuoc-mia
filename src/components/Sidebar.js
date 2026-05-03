"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Mobile: false = closed
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop: false = expanded
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width on mount
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsCollapsed(false); // Mobile uses isOpen instead
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Tổng Quan', path: '/' },
    { name: 'Bán Hàng', path: '/sales' },
    { name: 'Chi Phí', path: '/expenses' },
    { name: 'Quản Trị', path: '/admin' }
  ];

  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={() => {
          if (isMobile) {
            setIsOpen(!isOpen);
          } else {
            setIsCollapsed(!isCollapsed);
          }
        }}
      >
        {isCollapsed || (isMobile && !isOpen) ? '☰' : '✕'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Quản Lý</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nước Mía & Doanh Thu</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="btn w-full" style={{ background: '#fef2f2', color: 'var(--danger)' }}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div 
        className="sidebar-overlay" 
        onClick={() => setIsOpen(false)} 
        style={{ display: isOpen ? 'block' : 'none' }}
      ></div>
    </>
  );
}
