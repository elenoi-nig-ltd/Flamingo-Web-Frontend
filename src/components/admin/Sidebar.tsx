'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaBox, FaSignOutAlt, FaShoppingCart, FaWarehouse, FaCreditCard, FaHome, FaNetworkWired, FaBullhorn, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './SidebarContext';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const router = useRouter();
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const menuItems = [
    { name: 'Users', icon: <FaUser />, path: '/dashboard?tab=users', active: true },
    { name: 'Products', icon: <FaBox />, path: '/admin/dashboard/products', active: true },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders', active: false },
    { name: 'Inventory', icon: <FaWarehouse />, path: '/admin/inventory', active: false },
    { name: 'Payments', icon: <FaCreditCard />, path: '/admin/payments', active: false },
    { name: 'Real Estate', icon: <FaHome />, path: '/admin/real-estate', active: false },
    { name: 'Internet Packages', icon: <FaNetworkWired />, path: '/admin/internet-packages', active: false },
    { name: 'Promotions', icon: <FaBullhorn />, path: '/admin/promotions', active: false },
    { name: 'Messages', icon: <FaEnvelope />, path: '/admin/messages', active: false },
  ];

  const handleNavigation = (path: string, active: boolean) => {
    if (active) {
      router.push(path);
      // Close sidebar on mobile after navigation
      if (isMobile) {
        toggleSidebar();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`bg-black text-orange-400 h-screen fixed left-0 top-0 z-50 ${
          isMobile && !isOpen ? '-translate-x-full' : ''
        }`}
        initial={{ width: 256 }}
        animate={{ 
          width: isOpen ? 256 : (isMobile ? 256 : 256),
          x: isMobile && !isOpen ? -256 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <AnimatePresence>
              {isOpen && (
                <motion.h2
                  className="text-2xl font-bold text-orange-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Flamingo Admin
                </motion.h2>
              )}
            </AnimatePresence>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-orange-400 hover:text-orange-300 p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 p-4">
              {menuItems.map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ scale: item.active ? 1.05 : 1 }}
                  whileTap={{ scale: item.active ? 0.95 : 1 }}
                  className={`flex items-center p-2 rounded-md cursor-pointer
                    ${item.active ? 'hover:bg-orange-900/20' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => handleNavigation(item.path, item.active)}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-orange-900/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center p-2 w-full text-orange-400 hover:bg-orange-900/20 rounded-md"
              onClick={() => router.push('/admin/login')}
            >
              <FaSignOutAlt className="text-xl mr-3" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}