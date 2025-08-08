// components/LayoutClient.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header'; // adjust path if needed

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showHeader =
    pathname === '/' || pathname === '/admin/login' || pathname === '/admin/register';

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
