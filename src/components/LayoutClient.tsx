'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './admin/Sidebar';
import Topbar from './Topbar';
import { SidebarProvider, useSidebar } from './admin/SidebarContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const showHeader = ['/', '/admin/login', '/admin/register'].includes(pathname);
  const showSidebar = ['/admin/dashboard', '/products'].some(route => pathname.startsWith(route));
  const showTopbar = showSidebar; // Show topbar wherever sidebar is shown

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && <Header />}
        {showTopbar && (
          <div className={`transition-all duration-300 ${
            showSidebar 
              ? (isMobile 
                  ? 'ml-0' // On mobile, always ml-0 so topbar covers full screen
                  : 'ml-[256px]' // On desktop, account for sidebar
                )
              : ''
          }`}>
            <Topbar />
          </div>
        )}
        <main 
          className={`flex-1 overflow-auto transition-all duration-300 ${
            showSidebar 
              ? (isMobile 
                  ? 'ml-0' // On mobile, always ml-0 so content covers full screen
                  : 'ml-[256px]' // On desktop, always account for sidebar
                )
              : ''
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}