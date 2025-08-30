'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import ShopSidebar from '@/components/shop/ShopSidebar';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import ShopHeader from '@/components/shop/ShopHeader';
import Cart from './Cart';
import { useCart } from '@/hooks/useCart';
import Toast from '@/components/ui/Toast';
import { useCategories } from '@/hooks/useCategories';
import { usePublicProducts } from '@/hooks/usePublicProducts';

interface HomeItemsInterfaceProps {
  // Add any props if needed
}

const HomeItemsInterface: React.FC<HomeItemsInterfaceProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart('home-cart');

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = usePublicProducts();

  const selectedCategoryId = React.useMemo(() => {
    if (selectedCategory === 'All') return null;
    const cat = categories.find(c => c.name === selectedCategory);
    return cat ? cat._id : null;
  }, [selectedCategory, categories]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product: { id: string; name: string; image: string; price: number }) => {
    addToCart(product);
    setToast({
      message: `${product.name} added to cart!`,
      type: 'success',
      isVisible: true
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    removeFromCart(productId);
    if (item) {
      setToast({
        message: `${item.name} removed from cart`,
        type: 'info',
        isVisible: true
      });
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const item = cartItems.find(item => item.id === productId);
    updateQuantity(productId, quantity);
    if (item && quantity > 0) {
      setToast({
        message: `${item.name} quantity updated to ${quantity}`,
        type: 'info',
        isVisible: true
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search for home items..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to close cart/sidebar
      if (event.key === 'Escape') {
        if (isCartOpen) {
          setIsCartOpen(false);
        }
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
      
      // Ctrl/Cmd + B to toggle cart
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setIsCartOpen(!isCartOpen);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isCartOpen, isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ShopHeader
        title="Home Items & Quality Goods"
        searchPlaceholder="Search for home items..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={toggleSidebar}
        onToggleCart={toggleCart}
        totalItems={totalItems}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <ShopSidebar
          title="Home Items"
          isOpen={isSidebarOpen}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onClose={() => setIsSidebarOpen(false)}
          categories={['All', ...categories.map(c => c.name)]}
          isLoading={categoriesLoading}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-68">
          <ShopProductGrid
            products={products as any}
            selectedCategoryId={selectedCategoryId}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        totalPrice={totalPrice}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={clearCart}
      />
      
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default HomeItemsInterface;
