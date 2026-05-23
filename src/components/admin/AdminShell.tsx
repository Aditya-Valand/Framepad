'use client';

import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin">
      <AdminSidebar />
      <AdminMobileNav />
      <main className="main">
        {children}
      </main>
    </div>
  );
}
