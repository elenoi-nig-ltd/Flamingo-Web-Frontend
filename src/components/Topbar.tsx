// components/Topbar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FaBars, 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaCog,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from './admin/SidebarContext';
import { TopbarSkeleton } from './ui/SkeletonLoader';

const Topbar = () => {
  const { user, logout, loading } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New order received', time: '2 min ago', unread: true },
    { id: 2, message: 'Product inventory low', time: '1 hour ago', unread: true },
    { id: 3, message: 'User registration pending', time: '3 hours ago', unread: false },
    { id: 4, message: 'Payment processed successfully', time: '5 hours ago', unread: false },
  ]);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show skeleton while loading
  if (loading) {
    return <TopbarSkeleton />;
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section: Hamburger + Welcome Message */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right Section: Search + Notifications + Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <motion.div
              className={`relative ${isSearchFocused ? 'w-80' : 'w-64'} transition-all duration-200`}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </motion.div>
          </form>

          {/* Mobile Search Button */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors sm:hidden">
            <FaSearch className="text-lg" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-sm text-center text-orange-600 hover:text-orange-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name ? getInitials(user.name) : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <FaChevronDown className={`text-sm transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user?.name ? getInitials(user.name) : 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name || 'Admin'}</p>
                        <p className="text-sm text-gray-500">{user?.email || 'admin@example.com'}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role || 'Administrator'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                      <FaUser className="text-gray-400" />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                      <FaCog className="text-gray-400" />
                      <span>Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;