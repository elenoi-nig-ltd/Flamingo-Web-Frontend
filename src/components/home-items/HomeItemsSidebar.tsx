'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { useCategories } from '@/hooks/useCategories';

interface HomeItemsSidebarProps {
  isOpen: boolean;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onClose: () => void;
}

const HomeItemsSidebar: React.FC<HomeItemsSidebarProps> = ({
  isOpen,
  selectedCategory,
  onCategorySelect,
  onClose
}) => {
  const { categories, loading, error } = useCategories();
  const [localCategories, setLocalCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(['All', ...categories.map(cat => cat.name)]);
    } else if (!loading && !error) {
      setLocalCategories([
        'All',
        'Furniture',
        'Kitchen & Dining',
        'Bathroom',
        'Bedroom',
        'Lighting',
        'Home Decor'
      ]);
    }
  }, [categories, loading, error]);

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-gray-800 text-white z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Home Items</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
                <FaTimes />
              </button>
            </div>
            <nav className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <FaSpinner className="animate-spin text-2xl" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {localCategories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-amber-100 text-gray-800'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 0 }}
        animate={{ width: 272 }}
        className="hidden lg:block fixed left-0 top-0 w-68 bg-black text-white h-full z-30"
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Home Items</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {localCategories.map((category) => (
              <motion.li key={category} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-amber-100 text-gray-800'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default HomeItemsSidebar;
