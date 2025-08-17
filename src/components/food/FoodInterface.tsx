'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaSearch, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import FoodSidebar from './FoodSidebar';
import ProductGrid from './ProductGrid';
import Cart from './Cart';

const FoodInterface = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Sharmawa');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const addToCart = (product: { id: string; name: string; image: string; price: number }) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src={'/assets/icons/logo.png'}
                alt="Flamingo Logo"
                width={160}
                height={60}
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-white hover:bg-gray-700 rounded"
          >
            <FaBars className="text-xl" />
          </button>

                           {/* Cart Icon */}
                 <button 
                   onClick={() => setCartOpen(!cartOpen)}
                   className="p-2 text-white hover:bg-gray-700 rounded relative"
                 >
                   <FaShoppingCart className="text-xl" />
                   <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                     {cartItemCount}
                   </span>
                 </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FoodSidebar
          isOpen={sidebarOpen}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-amber-50 relative mt-20 lg:ml-68">
          {/* Product Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Food & Snacks
            </h1>
            
            <ProductGrid 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onAddToCart={addToCart}
            />
          </motion.div>

          {/* Cart Sidebar - Overlay */}
          {cartOpen && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 right-0 w-[28rem] h-full z-10"
            >
              <Cart
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
              />
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FoodInterface;
